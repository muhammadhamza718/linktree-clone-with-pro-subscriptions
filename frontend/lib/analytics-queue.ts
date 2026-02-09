/**
 * Analytics Event Queue Service
 * Handles asynchronous processing of analytics events to maintain <2s load times
 */

// Define interface for the event data input
export interface AnalyticsEventInput {
  profileId?: string;
  linkId?: string;
  variantId?: string;
  eventType: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  timezoneOffset?: number;
}

// Interface for event with timestamp in the queue
interface QueuedAnalyticsEvent extends AnalyticsEventInput {
  timestamp: Date;
}

// Simple in-memory queue implementation
// In production, this would use a proper queue system like BullMQ or Redis
const analyticsQueue: QueuedAnalyticsEvent[] = [];
let processing = false;

// Function to add an analytics event to the queue
export async function queueAnalyticsEvent(
  eventData: AnalyticsEventInput,
): Promise<void> {
  // Add timestamp
  const eventWithTimestamp: QueuedAnalyticsEvent = {
    ...eventData,
    timestamp: new Date(),
  };

  // Add to queue
  analyticsQueue.push(eventWithTimestamp);

  // Process queue if not already processing
  if (!processing) {
    void processQueue();
  }
}

// Function to process the queue asynchronously
async function processQueue(): Promise<void> {
  if (analyticsQueue.length === 0) {
    processing = false;
    return;
  }

  processing = true;

  // Take a batch of events to process
  const batchSize = 10; // Process 10 events at a time
  const batch = analyticsQueue.splice(0, batchSize);

  try {
    // In a real implementation, we would save these to the database
    // For now, we'll just simulate the async processing
    await saveBatchToDatabase(batch);
  } catch (error) {
    console.error("Error processing analytics batch:", error);
    // In a real implementation, we would retry or add to a dead letter queue
    // For now, put them back at the front of the queue
    analyticsQueue.unshift(...batch);
  } finally {
    // Process remaining events after a short delay to prevent event loop blocking
    if (analyticsQueue.length > 0) {
      setTimeout(() => {
        void processQueue();
      }, 1000);
    } else {
      processing = false;
    }
  }
}

// Simulate saving batch to database
async function saveBatchToDatabase(
  batch: QueuedAnalyticsEvent[],
): Promise<void> {
  // This would normally be a call to the database
  // Using Prisma to save the analytics events
  try {
    // Dynamic import to avoid circular dependencies if any
    const { default: prisma } = await import("./db");

    // Create many analytics events
    await prisma.analyticsEvent.createMany({
      data: batch.map((event) => ({
        profileId: event.profileId,
        linkId: event.linkId,
        eventType: event.eventType,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        referrer: event.referrer,
        country: event.country,
        city: event.city,
        deviceType: event.deviceType,
        browser: event.browser,
        os: event.os,
        timezoneOffset: event.timezoneOffset,
        timestamp: event.timestamp,
      })),
    });
  } catch (error) {
    console.error("Error saving analytics events to database:", error);
    throw error;
  }
}

// Function to flush the queue (useful for testing or shutdown)
export async function flushAnalyticsQueue(): Promise<void> {
  // Wait until queue is empty
  while (analyticsQueue.length > 0) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Wait for any active processing to complete
  if (processing) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
