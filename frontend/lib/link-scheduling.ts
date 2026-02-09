/**
 * Link Scheduling Service
 * Handles timezone-aware link visibility based on scheduled start/end dates
 */

import { Link } from "../types";

/**
 * Check if a link is currently visible based on its schedule and timezone
 * @param link The link object to check
 * @param currentTime The current time (default: now)
 * @returns boolean indicating if the link should be visible
 */
export function isLinkVisible(
  link: Link,
  currentTime: Date = new Date(),
): boolean {
  // If the link is explicitly set to not be visible via main toggle, return false
  if (!link.isVisible) {
    return false;
  }

  // If no schedule is set, the link is visible (controlled only by isVisible flag)
  if (!link.startDate && !link.endDate) {
    return true;
  }

  // Get current time in the link's timezone or UTC if not specified
  const linkTimezone = link.timezone || "UTC";

  // Create Date objects relative to the link's timezone
  // We compare times by converting everything to the target timezone
  const zonedCurrentTime = getZonedDate(currentTime, linkTimezone);

  // Check start date constraint
  if (link.startDate) {
    const startDate = new Date(link.startDate);
    // Convert start date to the same timezone reference for fair comparison
    const zonedStartDate = getZonedDate(startDate, linkTimezone);

    if (zonedCurrentTime < zonedStartDate) {
      return false; // Scheduled for future
    }
  }

  // Check end date constraint
  if (link.endDate) {
    const endDate = new Date(link.endDate);
    const zonedEndDate = getZonedDate(endDate, linkTimezone);

    if (zonedCurrentTime > zonedEndDate) {
      return false; // Expired
    }
  }

  return true;
}

/**
 * Returns a Date object representing the time in a specific timezone
 * This uses the Intl API which is standard in modern environments
 */
function getZonedDate(date: Date, timezone: string): Date {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(date);

    const partValues: Record<string, string> = {};
    parts.forEach((p) => {
      partValues[p.type] = p.value;
    });

    // Construct a new date object from the parts
    // Note: We use the values from the timezone but create a date object
    // that uses local time with these values for comparison purposes.
    // This allows us to compare "10:00 AM NY time" vs "11:00 AM NY time"
    // by comparing the underlying relative timestamps.
    return new Date(
      parseInt(partValues.year),
      parseInt(partValues.month) - 1,
      parseInt(partValues.day),
      parseInt(partValues.hour === "24" ? "0" : partValues.hour),
      parseInt(partValues.minute),
      parseInt(partValues.second),
    );
  } catch (error) {
    console.warn(
      `Invalid timezone '${timezone}', falling back to UTC/Local comparison`,
      error,
    );
    return date;
  }
}

/**
 * Get upcoming scheduled links for a profile
 */
export function getUpcomingLinks(
  links: Link[],
  currentTime: Date = new Date(),
): Link[] {
  return links.filter((link) => {
    if (!link.startDate) return false;

    const timezone = link.timezone || "UTC";
    const zonedCurrent = getZonedDate(currentTime, timezone);
    const zonedStart = getZonedDate(new Date(link.startDate), timezone);

    return zonedStart > zonedCurrent;
  });
}

/**
 * Get expired links that should no longer be visible
 */
export function getExpiredLinks(
  links: Link[],
  currentTime: Date = new Date(),
): Link[] {
  return links.filter((link) => {
    if (!link.endDate) return false;

    const timezone = link.timezone || "UTC";
    const zonedCurrent = getZonedDate(currentTime, timezone);
    const zonedEnd = getZonedDate(new Date(link.endDate), timezone);

    return zonedEnd < zonedCurrent;
  });
}

/**
 * Get currently active scheduled links
 * Returns links that are currently visible based on schedule
 */
export function getActiveScheduledLinks(
  links: Link[],
  currentTime: Date = new Date(),
): Link[] {
  return links.filter((link) => isLinkVisible(link, currentTime));
}
