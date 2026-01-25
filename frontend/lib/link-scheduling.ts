/**
 * Link Scheduling Service
 * Handles timezone-aware link visibility based on scheduled start/end dates
 */

import { Link } from '../types';

// Check if a link is currently visible based on its schedule and timezone
export function isLinkVisible(link: Link, currentTime: Date = new Date()): boolean {
  // If no schedule is set, the link is always visible
  if (!link.startDate && !link.endDate) {
    return link.isVisible; // Use the general visibility flag
  }

  // Convert current time to the link's timezone if specified
  let adjustedCurrentTime = currentTime;
  if (link.timezone) {
    try {
      // In a real implementation, we would convert the current time to the specified timezone
      // For now, we'll just use the provided timezone offset in minutes
      // This is a simplified approach - in reality, you'd use a library like date-fns-tz
      const timezoneOffset = getTimezoneOffset(link.timezone);
      if (timezoneOffset !== null) {
        // Adjust the current time based on the timezone offset
        adjustedCurrentTime = new Date(currentTime.getTime() + (timezoneOffset * 60000));
      }
    } catch (error) {
      console.warn('Could not process timezone, using default time:', error);
      // Continue with original time if timezone processing fails
    }
  }

  // Check start date constraint
  if (link.startDate) {
    const startDate = new Date(link.startDate);
    if (adjustedCurrentTime < startDate) {
      // Link hasn't started yet
      return false;
    }
  }

  // Check end date constraint
  if (link.endDate) {
    const endDate = new Date(link.endDate);
    if (adjustedCurrentTime > endDate) {
      // Link has expired
      return false;
    }
  }

  // If we got here, the link is within its scheduled timeframe
  // Return the general visibility flag
  return link.isVisible;
}

// Get the timezone offset in minutes for a given timezone string
function getTimezoneOffset(timezone: string): number | null {
  try {
    // Create a date in UTC
    const date = new Date();

    // Get the time in the specified timezone
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const newTime = new Date(utc + (getTimezoneOffsetByName(timezone) || 0));

    // Calculate the offset
    return (date.getTimezoneOffset() * -1) - (newTime.getTimezoneOffset() * -1);
  } catch (error) {
    return null;
  }
}

// Helper function to get offset for common timezones
function getTimezoneOffsetByName(timezone: string): number | null {
  // This is a simplified approach - in reality, you'd use Intl.DateTimeFormat
  const offsets: { [key: string]: number } = {
    'America/New_York': -300, // EST
    'America/Chicago': -360,  // CST
    'America/Denver': -420,   // MST
    'America/Los_Angeles': -480, // PST
    'Europe/London': 0,       // GMT
    'Europe/Paris': 60,       // CET
    'Asia/Tokyo': 540,        // JST
    'Asia/Shanghai': 480,     // CST
    'Australia/Sydney': 600,  // AEST
    'Pacific/Auckland': 720,  // NZST
  };

  return offsets[timezone] || null;
}

// Get upcoming scheduled links for a profile
export function getUpcomingLinks(links: Link[], currentTime: Date = new Date()): Link[] {
  return links.filter(link => {
    if (link.startDate) {
      const startDate = new Date(link.startDate);
      // Link starts in the future
      return startDate > currentTime;
    }
    return false;
  });
}

// Get expired links that should no longer be visible
export function getExpiredLinks(links: Link[], currentTime: Date = new Date()): Link[] {
  return links.filter(link => {
    if (link.endDate) {
      const endDate = new Date(link.endDate);
      // Link ended in the past
      return endDate < currentTime;
    }
    return false;
  });
}

// Get currently active scheduled links
export function getActiveScheduledLinks(links: Link[], currentTime: Date = new Date()): Link[] {
  return links.filter(link => {
    // Check if the link is within its scheduled timeframe
    return isLinkVisible(link, currentTime);
  });
}