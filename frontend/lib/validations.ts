import { isValidUsername, isValidUrl, isValidEmail, isValidBio, isValidLinkTitle, isValidImageUrl } from './utils';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// User validation
export function validateUser(userData: any): ValidationResult {
  const errors: string[] = [];

  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push('Valid email is required');
  }

  if (!userData.name || userData.name.trim().length === 0) {
    errors.push('Name is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Profile validation
export function validateProfile(profileData: any): ValidationResult {
  const errors: string[] = [];

  if (!profileData.username || !isValidUsername(profileData.username)) {
    errors.push('Username must be 3-30 characters and contain only letters, numbers, and hyphens');
  }

  if (!profileData.displayName || profileData.displayName.trim().length === 0) {
    errors.push('Display name is required');
  }

  if (profileData.bio && !isValidBio(profileData.bio)) {
    errors.push('Bio must be 280 characters or less');
  }

  if (profileData.avatar && !isValidImageUrl(profileData.avatar)) {
    errors.push('Avatar must be a valid image URL');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Link validation
export function validateLink(linkData: any): ValidationResult {
  const errors: string[] = [];

  if (!linkData.title || !isValidLinkTitle(linkData.title)) {
    errors.push('Link title is required and must be 1-100 characters');
  }

  if (!linkData.url || !isValidUrl(linkData.url)) {
    errors.push('Valid URL is required');
  }

  if (typeof linkData.order !== 'number' || linkData.order < 0) {
    errors.push('Order must be a non-negative number');
  }

  if (linkData.thumbnail && !isValidImageUrl(linkData.thumbnail)) {
    errors.push('Thumbnail must be a valid image URL');
  }

  if (linkData.icon && !isValidImageUrl(linkData.icon)) {
    errors.push('Icon must be a valid image URL');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Theme validation
export function validateTheme(themeData: any): ValidationResult {
  const errors: string[] = [];

  if (!themeData.name || themeData.name.trim().length === 0) {
    errors.push('Theme name is required');
  }

  // Validate color formats if provided
  if (themeData.backgroundColor && !isValidHexColor(themeData.backgroundColor) && !isValidRgbColor(themeData.backgroundColor)) {
    errors.push('Background color must be a valid hex or RGB color');
  }

  if (themeData.textColor && !isValidHexColor(themeData.textColor) && !isValidRgbColor(themeData.textColor)) {
    errors.push('Text color must be a valid hex or RGB color');
  }

  if (themeData.linkColor && !isValidHexColor(themeData.linkColor) && !isValidRgbColor(themeData.linkColor)) {
    errors.push('Link color must be a valid hex or RGB color');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper functions for color validation
function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

function isValidRgbColor(color: string): boolean {
  const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$|^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0\.\d+)\s*\)$/;
  return rgbRegex.test(color);
}