import prisma from "@/lib/db";
import { generateHmacSignature } from "@/lib/webhooks/security";

/**
 * Service to handle the actual HTTP delivery of webhook payloads
 */
export class WebhookDeliveryWorker {
  private static MAX_RETRIES = 3;
  private static INITIAL_BACKOFF = 1000; // 1 second

  /**
   * Delivers a webhook payload to the specified URL
   */
  static async deliver(
    deliveryId: string,
    url: string,
    payload: any,
    secret: string,
    attempt: number = 1,
  ) {
    const signature = generateHmacSignature(payload, secret);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Linktree-Signature": signature,
          "User-Agent": "Linktree-Webhook-Delivery-Worker/1.0",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (response.ok) {
        // Success
        await prisma.webhookDelivery.update({
          where: { id: deliveryId },
          data: {
            status: "success",
            statusCode: response.status,
            response: responseText.substring(0, 1000), // Limit response size
            deliveredAt: new Date(),
          },
        });

        // Update last triggered at on the endpoint
        const delivery = await prisma.webhookDelivery.findUnique({
          where: { id: deliveryId },
          select: { webhookId: true },
        });
        if (delivery) {
          await prisma.webhookEndpoint.update({
            where: { id: delivery.webhookId },
            data: { lastTriggered: new Date() },
          });
        }
      } else {
        // HTTP error, consider retry
        await this.handleFailure(
          deliveryId,
          url,
          payload,
          secret,
          attempt,
          response.status,
          responseText,
        );
      }
    } catch (error: any) {
      // Network error, consider retry
      await this.handleFailure(
        deliveryId,
        url,
        payload,
        secret,
        attempt,
        0,
        error.message,
      );
    }
  }

  /**
   * Handles delivery failure and schedules retries
   */
  private static async handleFailure(
    deliveryId: string,
    url: string,
    payload: any,
    secret: string,
    attempt: number,
    statusCode: number,
    error: string,
  ) {
    const shouldRetry = attempt < this.MAX_RETRIES;

    await prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        status: shouldRetry ? "pending" : "failed",
        statusCode: statusCode || null,
        response: error.substring(0, 1000),
        attemptCount: attempt,
      },
    });

    if (shouldRetry) {
      const delay = this.INITIAL_BACKOFF * Math.pow(2, attempt - 1);

      // In a real system, you'd use a queued job with a delay.
      // Here we use setTimeout as a simple demonstration.
      setTimeout(() => {
        this.deliver(deliveryId, url, payload, secret, attempt + 1).catch(
          (err) => {
            console.error(
              `Retry attempt ${attempt + 1} failed for ${deliveryId}:`,
              err,
            );
          },
        );
      }, delay);
    }
  }
}
