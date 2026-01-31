import prisma from "@/lib/db";

/**
 * Service to handle traffic splitting and variant selection for A/B tests
 */
export class TrafficSplitter {
  /**
   * Selects a variant for a link based on configured traffic split percentages
   * @param linkId The ID of the link to split traffic for
   * @returns The selected LinkVariant or null if no variants exist
   */
  static async selectVariant(linkId: string) {
    try {
      // 1. Fetch active variants for this link
      const variants = await prisma.linkVariant.findMany({
        where: { linkId },
        orderBy: { createdAt: "asc" },
      });

      if (variants.length === 0) return null;

      // 2. Select variant based on weighted random selection
      const totalWeight = variants.reduce(
        (sum: number, v: any) => sum + v.trafficSplitPercent,
        0,
      );

      // If no weight (0% for all), fallback to random or first
      if (totalWeight === 0) {
        return variants[Math.floor(Math.random() * variants.length)];
      }

      const random = Math.floor(Math.random() * totalWeight);
      let offset = 0;

      for (const variant of variants) {
        offset += variant.trafficSplitPercent;
        if (random < offset) {
          // Increment view count for the selected variant
          await prisma.linkVariant.update({
            where: { id: variant.id },
            data: { viewCount: { increment: 1 } },
          });
          return variant;
        }
      }

      return variants[0]; // Fallback
    } catch (error) {
      console.error("Error selecting A/B test variant:", error);
      return null;
    }
  }

  /**
   * Records a click for a link variant
   */
  static async recordClick(variantId: string) {
    try {
      await prisma.linkVariant.update({
        where: { id: variantId },
        data: { clickCount: { increment: 1 } },
      });
    } catch (error) {
      console.error("Error recording A/B test click:", error);
    }
  }
}
