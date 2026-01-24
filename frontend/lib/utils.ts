import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Username validation: alphanumeric + hyphens only, 3-30 characters
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]{1,30}$/;
  return (
    username.length >= 3 &&
    username.length <= 30 &&
    usernameRegex.test(username)
  );
}

// URL validation
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Bio character limit (max 280 chars)
export function isValidBio(bio: string): boolean {
  return bio.length <= 280;
}

// Link title character limit (max 100 chars)
export function isValidLinkTitle(title: string): boolean {
  return title.length > 0 && title.length <= 100;
}

// Image URL validation
export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return validExtensions.some(ext => url.toLowerCase().endsWith(ext)) ||
           url.startsWith('data:image');
  } catch (e) {
    return false;
  }
}