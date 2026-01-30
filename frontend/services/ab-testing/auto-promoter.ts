import prisma from "@/lib/db";
import { ABTestStatistics } from "./statistics";

/**
 * Service to automatically promote winning variants in A/B tests
 */
export class AutoPromoter {
  private static CONFIDENCE_THRESHOLD = 95; // 95% confidence
  private static MIN_SAMPLES = 100; // Minimum 100 views per variant

  /**
   * Checks if an A/B test has a clear winner and promotes it if configured
   */
  static async checkAndPromote(testId: string) {
    try {
      const test = await prisma.aBTest.findUnique({
        where: { id: testId },
        include: { variants: true },
      });

      if (!test || test.status !== "running") return;

      const variants = test.variants;
      if (variants.length < 2) return;

      // Find leading variant (highest CTR)
      const sorted = [...variants].sort((a, b) => {
        return (
          ABTestStatistics.calculateCTR(b.clickCount, b.viewCount) -
          ABTestStatistics.calculateCTR(a.clickCount, a.viewCount)
        );
      });

      const leader = sorted[0];
      const challenger = sorted[1];

      // Check if minimum sample size is met
      if (
        leader.viewCount < this.MIN_SAMPLES ||
        challenger.viewCount < this.MIN_SAMPLES
      )
        return;

      // Check statistical significance
      const pValue = ABTestStatistics.calculateSignificance(
        { clicks: leader.clickCount, views: leader.viewCount },
        { clicks: challenger.clickCount, views: challenger.viewCount },
      );

      const confidence = ABTestStatistics.getConfidenceLevel(pValue);

      if (confidence >= this.CONFIDENCE_THRESHOLD) {
        // We have a winner!
        console.log(
          `A/B Test ${testId} has a winner: ${leader.variantName} with ${confidence.toFixed(2)}% confidence.`,
        );

        await prisma.aBTest.update({
          where: { id: testId },
          data: {
            status: "completed",
            winnerVariantId: leader.id,
            endedAt: new Date(),
            confidenceLevel: confidence,
          },
        });

        // In a real system, you would update the original link here
        // or set a flag to only use the winner for future visitors.
      }
    } catch (error) {
      console.error("Error in auto-promotion:", error);
    }
  }
}
