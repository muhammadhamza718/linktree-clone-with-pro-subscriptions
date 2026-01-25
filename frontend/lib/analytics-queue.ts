/**
 * Analytics Event Queue Service
 * Handles asynchronous processing of analytics events to maintain <2s load times
 */

// Simple in-memory queue implementation for now
// In production, this would use a proper queue system like BullMQ or Redis
let analyticsQueue: any[] = [];
let processing = false;

// Function to add an analytics event to the queue
export async function queueAnalyticsEvent(eventData: {
  profileId?: string;
  linkId?: string;
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
}) {
  // Add timestamp
  const eventWithTimestamp = {
    ...eventData,
    timestamp: new Date(),
  };

  // Add to queue
  analyticsQueue.push(eventWithTimestamp);

  // Process queue if not already processing
  if (!processing) {
    processQueue();
  }
}

// Function to process the queue asynchronously
async function processQueue() {
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
    console.error('Error processing analytics batch:', error);
    // In a real implementation, we would retry or add to a dead letter queue
  } finally {
    // Process remaining events after a delay
    setTimeout(processQueue, 1000); // Process next batch after 1 second
  }
}

// Simulate saving batch to database
async function saveBatchToDatabase(batch: any[]) {
  // This would normally be a call to the database
  // Using Prisma to save the analytics events
  try {
    // Import prisma client
    const { default: prisma } = await import('./db');

    // Create many analytics events
    await prisma.analyticsEvent.createMany({
      data: batch.map(event => ({
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
    console.error('Error saving analytics events to database:', error);
    // Re-add failed events to queue for retry
    analyticsQueue.unshift(...batch);
    throw error;
  }
}

// Function to flush the queue (useful for testing or shutdown)
export async function flushAnalyticsQueue() {
  while (analyticsQueue.length > 0) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait a bit
  }
  // Wait for processing to complete
  if (processing) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}