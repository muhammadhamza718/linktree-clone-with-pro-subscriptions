import prisma from "@/lib/db";
import { generateHmacSignature } from "@/lib/webhooks/security";

export type WebhookEvent =
  | "profile_view"
  | "link_click"
  | "form_submission"
  | "profile_updated";

interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: any;
  visitor?: {
    ipHash?: string;
    device?: string;
    country?: string;
    city?: string;
    browser?: string;
    os?: string;
  };
}

/**
 * Service to emit webhook events to configured endpoints
 */
export class WebhookEventEmitter {
  /**
   * Triggers a webhook event for a specific user
   * @param userId The ID of the user whose webhooks should be triggered
   * @param event The type of event being triggered
   * @param data The event-specific data
   * @param visitor Optional visitor metadata
   */
  static async emit(
    userId: string,
    event: WebhookEvent,
    data: any,
    visitor?: WebhookPayload["visitor"],
  ) {
    try {
      // 1. Fetch active webhook endpoints for this user that listen to this event
      const endpoints = await prisma.webhookEndpoint.findMany({
        where: {
          userId,
          isActive: true,
          // Since events is stored as a JSON string or comma-separated string in Prisma
          // we filter them in memory or use a more complex query if needed.
          // For now, we assume it's a JSON-stringified array of strings.
        },
      });

      const activeEndpoints = endpoints.filter((endpoint: any) => {
        try {
          const subscribedEvents = JSON.parse(endpoint.events) as string[];
          return subscribedEvents.includes(event);
        } catch (e) {
          console.error(`Error parsing events for webhook ${endpoint.id}:`, e);
          return false;
        }
      });

      if (activeEndpoints.length === 0) return;

      // 2. Prepare payload
      const payload: WebhookPayload = {
        event,
        timestamp: new Date().toISOString(),
        data,
        visitor,
      };

      // 3. Queue deliveries for each endpoint
      // In a production app, this would go to a real queue like Redis/RabbitMQ.
      // For this implementation, we spawn them as async tasks or record them for a worker.
      await Promise.all(
        activeEndpoints.map(async (endpoint: any) => {
          // Record the delivery attempt in the database
          const delivery = await prisma.webhookDelivery.create({
            data: {
              webhookId: endpoint.id,
              payload: payload as any,
              status: "pending",
              attemptCount: 1,
            },
          });

          // In a real environment, we'd trigger the worker here.
          // For now, we'll call a mock delivery function or the actual delivery logic.
          // We'll implement the actual delivery in the delivery-worker service.
          this.triggerDelivery(
            delivery.id,
            endpoint.url,
            payload,
            endpoint.secret,
          );
        }),
      );
    } catch (error) {
      console.error("Error emitting webhook event:", error);
    }
  }

  /**
   * Internal method to trigger the delivery process
   * In production, this would be handled by a persistent worker.
   */
  private static async triggerDelivery(
    deliveryId: string,
    url: string,
    payload: WebhookPayload,
    secret: string,
  ) {
    // This will be handled by the DeliveryWorker.
    // We import it dynamically to avoid circular dependencies if any.
    try {
      const { WebhookDeliveryWorker } = await import("./delivery-worker");
      // Execute asynchronously
      WebhookDeliveryWorker.deliver(deliveryId, url, payload, secret).catch(
        (err) => {
          console.error(`Failed to deliver webhook ${deliveryId}:`, err);
        },
      );
    } catch (err) {
      console.error("Error loading WebhookDeliveryWorker:", err);
    }
  }
}
