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

// Validation for contact forms
export function validateContactForm(formData: { name?: string; email?: string; message: string }): ValidationResult {
  const errors: string[] = [];

  if (!formData.message || formData.message.trim().length === 0) {
    errors.push('Message is required');
  }

  if (formData.message && formData.message.length > 1000) {
    errors.push('Message must be less than 1000 characters');
  }

  if (formData.email && !isValidEmail(formData.email)) {
    errors.push('Valid email is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validation for rich content blocks
export function validateRichContentBlock(blockData: any): ValidationResult {
  const errors: string[] = [];

  if (!blockData.contentType || !['embed', 'text', 'form', 'gallery'].includes(blockData.contentType)) {
    errors.push('Content type must be one of: embed, text, form, gallery');
  }

  if (!blockData.content || blockData.content.trim().length === 0) {
    errors.push('Content is required');
  }

  if (blockData.contentType === 'embed' && !isValidUrl(blockData.content)) {
    errors.push('Embed content must be a valid URL');
  }

  if (blockData.title && blockData.title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }

  if (typeof blockData.position !== 'number') {
    errors.push('Position must be a number');
  }

  if (blockData.position < 0) {
    errors.push('Position must be a non-negative number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validation for custom domains
export function validateCustomDomain(domainData: any): ValidationResult {
  const errors: string[] = [];

  if (!domainData.domain || domainData.domain.trim().length === 0) {
    errors.push('Domain is required');
  }

  // Basic domain validation (more sophisticated validation would use DNS check)
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/;
  if (domainData.domain && !domainRegex.test(domainData.domain)) {
    errors.push('Domain must be a valid domain format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validation for custom CSS
export function validateCustomCSS(cssData: any): ValidationResult {
  const errors: string[] = [];

  if (!cssData.cssCode || cssData.cssCode.trim().length === 0) {
    errors.push('CSS code is required');
  }

  // Basic validation to check for potentially dangerous CSS
  const dangerousPatterns = [
    /expression\s*\(/i,  // CSS expressions
    /javascript:/i,      // JS in CSS
    /vbscript:/i,        // VBScript in CSS
    /data:/i,            // Data URIs (could be dangerous)
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(cssData.cssCode)) {
      errors.push('CSS contains potentially dangerous patterns');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validation for analytics events
export function validateAnalyticsEvent(eventData: any): ValidationResult {
  const errors: string[] = [];

  if (!eventData.eventType || !['profile_view', 'link_click'].includes(eventData.eventType)) {
    errors.push('Event type must be either "profile_view" or "link_click"');
  }

  if (eventData.ipAddress && typeof eventData.ipAddress !== 'string') {
    errors.push('IP address must be a string');
  }

  if (eventData.userAgent && typeof eventData.userAgent !== 'string') {
    errors.push('User agent must be a string');
  }

  if (eventData.referrer && typeof eventData.referrer !== 'string') {
    errors.push('Referrer must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}