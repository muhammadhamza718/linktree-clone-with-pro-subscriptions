/**
 * Service to calculate statistical significance and performance metrics for A/B tests
 */
export class ABTestStatistics {
  /**
   * Calculates the Click-Through Rate (CTR) for a variant
   */
  static calculateCTR(clicks: number, views: number): number {
    if (views === 0) return 0;
    return (clicks / views) * 100;
  }

  /**
   * Calculates the statistical significance (p-value) between two variants
   * using a Chi-squared test for independence
   */
  static calculateSignificance(
    v1: { clicks: number; views: number },
    v2: { clicks: number; views: number },
  ): number {
    const n1 = v1.views;
    const clicks1 = v1.clicks;
    const n2 = v2.views;
    const clicks2 = v2.clicks;

    if (n1 === 0 || n2 === 0) return 1.0;

    const p1 = clicks1 / n1;
    const p2 = clicks2 / n2;

    const combinedP = (clicks1 + clicks2) / (n1 + n2);
    const standardError = Math.sqrt(
      combinedP * (1 - combinedP) * (1 / n1 + 1 / n2),
    );

    if (standardError === 0) return 1.0;

    const zScore = Math.abs(p1 - p2) / standardError;

    // Convert Z-score to p-value (approximate)
    // 1.96 = 95% confidence (p < 0.05)
    // 2.58 = 99% confidence (p < 0.01)
    const pValue = 2 * (1 - this.phi(zScore));
    return pValue;
  }

  /**
   * Cumulative distribution function for standard normal distribution
   */
  private static phi(x: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x) / Math.sqrt(2.0);

    const t = 1.0 / (1.0 + p * absX);
    const y =
      1.0 -
      ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
        t *
        Math.exp(-absX * absX);

    return 0.5 * (1.0 + sign * y);
  }

  /**
   * Returns a confidence score as a percentage (1 - pValue)
   */
  static getConfidenceLevel(p: number): number {
    return Math.max(0, (1 - p) * 100);
  }
}
