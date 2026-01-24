// Integration test for profile creation
import { validateProfile } from '../../lib/validations';

describe('Profile Creation Integration', () => {
  test('should validate valid profile data', () => {
    const profileData = {
      username: 'testuser',
      displayName: 'Test User',
      bio: 'This is a test bio',
      avatar: 'https://example.com/avatar.png',
      avatarLayout: 'classic' as const,
    };

    const result = validateProfile(profileData);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject invalid username', () => {
    const profileData = {
      username: 'ab', // Too short
      displayName: 'Test User',
    };

    const result = validateProfile(profileData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Username must be 3-30 characters and contain only letters, numbers, and hyphens');
  });

  test('should reject missing display name', () => {
    const profileData = {
      username: 'testuser',
      displayName: '',
    };

    const result = validateProfile(profileData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Display name is required');
  });

  test('should reject overly long bio', () => {
    const longBio = 'a'.repeat(300); // Exceeds 280 char limit
    const profileData = {
      username: 'testuser',
      displayName: 'Test User',
      bio: longBio,
    };

    const result = validateProfile(profileData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Bio must be 280 characters or less');
  });
});