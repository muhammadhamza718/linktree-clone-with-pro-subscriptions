import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates a username
 * Rules:
 * - 3-30 characters long
 * - Alphanumeric characters and hyphens only
 * - Cannot start or end with a hyphen
 */
export function isValidUsername(username: string): boolean {
  // Regex:
  // ^       Start of string
  // [a-zA-Z0-9]  Must start with alphanumeric
  // (       Group for middle part
  //   [a-zA-Z0-9-]*  Alphanumeric or hyphens
  //   [a-zA-Z0-9]    Must end with alphanumeric (if length > 1)
  // )?      Middle part is optional (matches 1 char string if removed, but length check handles it)
  // $       End of string
  const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  return (
    username.length >= 3 &&
    username.length <= 30 &&
    usernameRegex.test(username)
  );
}

/**
 * Validates a URL
 * Ensures it starts with http/https and is a valid URL structure
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
}

/**
 * Validates an email address
 * Uses a standard robust regex for email validation
 */
export function isValidEmail(email: string): boolean {
  // Simple but effective regex for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates bio length
 * Max 280 characters
 */
export function isValidBio(bio: string): boolean {
  return bio.length <= 280;
}

/**
 * Validates link title length
 * Max 100 characters, non-empty
 */
export function isValidLinkTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 100;
}

/**
 * Validates if a string is a valid image URL
 * Checks for valid extensions or data URI format
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;

  // Check for data URI
  if (url.startsWith("data:image/")) return true;

  // Check for valid URL structure
  if (!isValidUrl(url)) return false;

  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname.toLowerCase();
    const validExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".ico",
      ".bmp",
      ".tiff",
    ];

    // Check if path ends with extension, or if it's a known image host that might not have extension (e.g. unsplash source)
    // For strict checking, we rely on extensions, but for some services we might need to be invalid.
    return validExtensions.some((ext) => pathname.endsWith(ext));
  } catch (e) {
    return false;
  }
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string | number): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncates a string to a maximum length
 */
export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}
