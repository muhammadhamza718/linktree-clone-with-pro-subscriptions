import { generateHmacSignature, verifyHmacSignature } from '../../../lib/webhooks/security';

describe('Webhook HMAC Security Functions', () => {
  const testPayload = { event: 'profile_view', data: { profileId: 'test123', timestamp: Date.now() } };
  const testSecret = 'test-secret-key';

  describe('generateHmacSignature', () => {
    it('should generate a valid HMAC signature', () => {
      const signature = generateHmacSignature(testPayload, testSecret);
      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.startsWith('sha256=')).toBe(true);
    });

    it('should generate consistent signatures for same input', () => {
      const signature1 = generateHmacSignature(testPayload, testSecret);
      const signature2 = generateHmacSignature(testPayload, testSecret);

      expect(signature1).toBe(signature2);
    });

    it('should generate different signatures for different secrets', () => {
      const signature1 = generateHmacSignature(testPayload, testSecret);
      const signature2 = generateHmacSignature(testPayload, 'different-secret');

      expect(signature1).not.toBe(signature2);
    });

    it('should handle empty payload', () => {
      const emptyPayload = {};
      const signature = generateHmacSignature(emptyPayload, testSecret);
      expect(signature).toBeDefined();
      expect(signature.startsWith('sha256=')).toBe(true);
    });

    it('should handle complex nested payloads', () => {
      const complexPayload = {
        event: 'link_click',
        data: {
          linkId: 'link123',
          profileId: 'profile123',
          metadata: {
            userAgent: 'Mozilla/5.0...',
            ipHash: 'hashed_ip_value',
            timestamp: Date.now(),
            referrer: 'https://example.com'
          }
        }
      };
      const signature = generateHmacSignature(complexPayload, testSecret);
      expect(signature).toBeDefined();
      expect(signature.startsWith('sha256=')).toBe(true);
    });
  });

  describe('verifyHmacSignature', () => {
    it('should return true for valid signature', () => {
      const signature = generateHmacSignature(testPayload, testSecret);
      const isValid = verifyHmacSignature(testPayload, signature, testSecret);

      expect(isValid).toBe(true);
    });

    it('should return false for invalid signature', () => {
      const signature = 'sha256=invalid-signature';
      const isValid = verifyHmacSignature(testPayload, signature, testSecret);

      expect(isValid).toBe(false);
    });

    it('should return false for different secret', () => {
      const signature = generateHmacSignature(testPayload, testSecret);
      const isValid = verifyHmacSignature(testPayload, signature, 'wrong-secret');

      expect(isValid).toBe(false);
    });

    it('should return false for tampered payload', () => {
      const signature = generateHmacSignature(testPayload, testSecret);
      const tamperedPayload = { ...testPayload, data: { ...testPayload.data, timestamp: Date.now() + 1000 } };
      const isValid = verifyHmacSignature(tamperedPayload, signature, testSecret);

      expect(isValid).toBe(false);
    });

    it('should handle malformed signature format', () => {
      const isValid = verifyHmacSignature(testPayload, 'invalid-format', testSecret);
      expect(isValid).toBe(false);
    });

    it('should handle missing signature prefix', () => {
      const signatureWithoutPrefix = generateHmacSignature(testPayload, testSecret).replace('sha256=', '');
      const isValid = verifyHmacSignature(testPayload, signatureWithoutPrefix, testSecret);
      expect(isValid).toBe(false);
    });
  });
});