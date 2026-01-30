import crypto from 'crypto';

/**
 * Generates an HMAC signature for webhook payloads
 * @param payload The webhook payload data
 * @param secret The webhook secret for signing
 * @returns HMAC signature in format "sha256=<signature>"
 */
export function generateHmacSignature(payload: any, secret: string): string {
  // Convert payload to JSON string for consistent hashing
  const payloadString = JSON.stringify(payload);

  // Create HMAC signature using SHA-256
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex');

  return `sha256=${signature}`;
}

/**
 * Verifies an HMAC signature against a payload
 * @param payload The webhook payload data
 * @param signature The signature to verify (format: "sha256=<signature>")
 * @param secret The webhook secret used for verification
 * @returns Boolean indicating if signature is valid
 */
export function verifyHmacSignature(payload: any, signature: string, secret: string): boolean {
  try {
    // Ensure signature has the expected format
    if (!signature || !signature.startsWith('sha256=')) {
      console.error('Invalid signature format');
      return false;
    }

    // Extract the signature part after the algorithm prefix
    const signatureHash = signature.split('=')[1];
    if (!signatureHash) {
      console.error('No signature hash found in signature string');
      return false;
    }

    // Generate expected signature
    const expectedSignature = generateHmacSignature(payload, secret);
    const expectedHash = expectedSignature.split('=')[1];

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signatureHash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  } catch (error) {
    console.error('Error verifying HMAC signature:', error);
    return false;
  }
}

/**
 * Validates webhook configuration parameters
 * @param url The webhook endpoint URL
 * @param events The events to listen for
 * @param secret The webhook secret
 * @returns Object with validation result and errors
 */
export function validateWebhookConfig(url: string, events: string[], secret: string) {
  const errors: string[] = [];

  // Validate URL
  try {
    new URL(url);
  } catch (error) {
    errors.push('Invalid webhook URL format');
  }

  // Validate events array
  if (!Array.isArray(events) || events.length === 0) {
    errors.push('Events must be a non-empty array');
  } else {
    const validEvents = ['profile_view', 'link_click', 'form_submission', 'profile_updated'];
    for (const event of events) {
      if (typeof event !== 'string' || !validEvents.includes(event)) {
        errors.push(`Invalid event type: ${event}. Valid events are: ${validEvents.join(', ')}`);
      }
    }
  }

  // Validate secret
  if (!secret || typeof secret !== 'string' || secret.length < 16) {
    errors.push('Webhook secret must be a string of at least 16 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}