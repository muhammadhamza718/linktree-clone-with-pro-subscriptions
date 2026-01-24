// Unit test for User registration validation
import { validateUser } from '../../lib/validations';

describe('User Registration Validation', () => {
  test('should validate valid user data', () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User'
    };

    const result = validateUser(userData);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject invalid email', () => {
    const userData = {
      email: 'invalid-email',
      name: 'Test User'
    };

    const result = validateUser(userData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Valid email is required');
  });

  test('should reject missing name', () => {
    const userData = {
      email: 'test@example.com',
      name: ''
    };

    const result = validateUser(userData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name is required');
  });

  test('should reject empty name', () => {
    const userData = {
      email: 'test@example.com',
      name: '   '
    };

    const result = validateUser(userData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name is required');
  });
});