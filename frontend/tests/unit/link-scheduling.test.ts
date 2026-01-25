import { isLinkVisible } from '../../lib/link-scheduling';

// Test for "Is link visible based on schedule?" logic
describe('Link Scheduling Visibility Logic', () => {
  beforeEach(() => {
    // Set a fixed date for testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 0, 24, 12, 0, 0)); // Jan 24, 2026 at 12:00 PM
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return true for link without scheduling', () => {
    const link = {
      isVisible: true,
      startDate: null,
      endDate: null,
    };

    const result = isLinkVisible(link);
    expect(result).toBe(true);
  });

  test('should return false for link with future start date', () => {
    const link = {
      isVisible: true,
      startDate: new Date(2026, 0, 25), // Jan 25, 2026 (future)
      endDate: null,
    };

    const result = isLinkVisible(link);
    expect(result).toBe(false);
  });

  test('should return true for link with past start date', () => {
    const link = {
      isVisible: true,
      startDate: new Date(2026, 0, 23), // Jan 23, 2026 (past)
      endDate: null,
    };

    const result = isLinkVisible(link);
    expect(result).toBe(true);
  });

  test('should return false for link with past end date', () => {
    const link = {
      isVisible: true,
      startDate: null,
      endDate: new Date(2026, 0, 23), // Jan 23, 2026 (past)
    };

    const result = isLinkVisible(link);
    expect(result).toBe(false);
  });

  test('should return true for link within scheduled timeframe', () => {
    const link = {
      isVisible: true,
      startDate: new Date(2026, 0, 23), // Jan 23, 2026 (past)
      endDate: new Date(2026, 0, 25), // Jan 25, 2026 (future)
    };

    const result = isLinkVisible(link);
    expect(result).toBe(true);
  });

  test('should return false for link outside scheduled timeframe', () => {
    const link = {
      isVisible: true,
      startDate: new Date(2026, 0, 22), // Jan 22, 2026 (past)
      endDate: new Date(2026, 0, 23), // Jan 23, 2026 (past)
    };

    const result = isLinkVisible(link);
    expect(result).toBe(false);
  });

  test('should respect isVisible flag even when within schedule', () => {
    const link = {
      isVisible: false, // Explicitly hidden
      startDate: new Date(2026, 0, 23), // Jan 23, 2026 (valid schedule)
      endDate: new Date(2026, 0, 25), // Jan 25, 2026 (valid schedule)
    };

    const result = isLinkVisible(link);
    expect(result).toBe(false);
  });

  test('should return false for link with future start date even if isVisible is true', () => {
    const link = {
      isVisible: true,
      startDate: new Date(2026, 0, 25), // Jan 25, 2026 (future)
      endDate: new Date(2026, 0, 26), // Jan 26, 2026 (future)
    };

    const result = isLinkVisible(link);
    expect(result).toBe(false);
  });
});