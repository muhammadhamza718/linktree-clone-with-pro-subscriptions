import { Prisma } from "@prisma/client";
import prisma from "./db";

/**
 * Service for exporting analytics data as CSV
 */

export type AnalyticsDataType =
  | "clicks"
  | "views"
  | "referrers"
  | "demographics";

export interface AnalyticsExportOptions {
  profileId: string;
  startDate: Date;
  endDate: Date;
  dataType: AnalyticsDataType;
}

/**
 * Exports analytics data as a CSV string
 * @param options Export configuration options
 * @returns Promise resolving to a CSV string
 */
export async function exportAnalyticsData(
  options: AnalyticsExportOptions,
): Promise<string> {
  try {
    const data = await fetchAnalyticsData(options);

    if (!data || data.length === 0) {
      return "No data available for the selected period";
    }

    return convertToCsv(data);
  } catch (error) {
    console.error("Error exporting analytics data:", error);
    throw new Error(
      `Failed to export analytics data: ${(error as Error).message}`,
    );
  }
}

/**
 * Fetches the raw analytics data based on the requested type
 */
async function fetchAnalyticsData(
  options: AnalyticsExportOptions,
): Promise<Record<string, any>[]> {
  const { profileId, startDate, endDate, dataType } = options;

  const dateFilter = {
    gte: startDate,
    lte: endDate,
  };

  switch (dataType) {
    case "clicks":
      return await prisma.analyticsEvent.findMany({
        where: {
          profileId,
          eventType: "link_click",
          timestamp: dateFilter,
        },
        include: {
          link: {
            select: {
              title: true,
              url: true,
            },
          },
        },
        orderBy: { timestamp: "desc" },
      });

    case "views":
      return await prisma.analyticsEvent.findMany({
        where: {
          profileId,
          eventType: "profile_view",
          timestamp: dateFilter,
        },
        orderBy: { timestamp: "desc" },
      });

    case "referrers":
      const referrers = await prisma.analyticsEvent.groupBy({
        by: ["referrer"],
        where: {
          profileId,
          eventType: "profile_view",
          referrer: { not: null },
          timestamp: dateFilter,
        },
        _count: {
          referrer: true,
        },
        orderBy: { _count: { referrer: "desc" } },
      });

      // Flatten the structure for CSV export
      return referrers.map((item: any) => ({
        referrer: item.referrer,
        count: item._count.referrer,
      }));

    case "demographics":
      return await prisma.analyticsEvent.findMany({
        where: {
          profileId,
          timestamp: dateFilter,
        },
        select: {
          country: true,
          city: true,
          deviceType: true,
          browser: true,
          os: true,
          timestamp: true,
        },
        orderBy: { timestamp: "desc" },
      });

    default:
      throw new Error(`Invalid data type: ${dataType}`);
  }
}

/**
 * Converts an array of objects to a CSV string
 */
function convertToCsv(data: Record<string, any>[]): string {
  if (data.length === 0) return "";

  // Generate headers from the first object's keys
  const headers = Object.keys(data[0]);
  const headerRow = headers.join(",");

  const rows = data.map((item) => {
    return headers
      .map((header) => {
        const value = item[header];
        return formatCsvValue(value);
      })
      .join(",");
  });

  return [headerRow, ...rows].join("\n");
}

/**
 * Formats a single value for CSV inclusion
 */
function formatCsvValue(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return `"${value.toISOString()}"`;
  }

  if (typeof value === "object") {
    // Check if it's a nested object (like the included 'link' relation)
    // and try to simplify it, or just JSON stringify it
    return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
  }

  const stringValue = String(value);
  // If value contains comma, newline or double quote, enclose in quotes and escape double quotes
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}
