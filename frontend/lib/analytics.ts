/**
 * Analytics Service
 * Handles analytics event tracking, processing, and retrieval
 */

import prisma from "./db";
import { WebhookEventEmitter } from "../services/webhooks/event-emitter";

// Interface for analytics tracking data
export interface AnalyticsTrackData {
  profileId?: string;
  linkId?: string;
  eventType: "profile_view" | "link_click";
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  deviceType?: "mobile" | "tablet" | "desktop";
  browser?: string;
  os?: string;
  timezoneOffset?: number;
}

// Track an analytics event (will be queued for async processing)
export async function trackAnalyticsEvent(
  data: AnalyticsTrackData,
): Promise<string> {
  try {
    const event = await prisma.analyticsEvent.create({
      data: {
        profileId: data.profileId,
        linkId: data.linkId,
        eventType: data.eventType,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referrer: data.referrer,
        country: data.country,
        city: data.city,
        deviceType: data.deviceType,
        browser: data.browser,
        os: data.os,
        timezoneOffset: data.timezoneOffset,
      },
    });

    // Trigger Webhook Event if profileId is present
    if (data.profileId) {
      // We need the userId to trigger webhooks
      const profile = await prisma.profile.findUnique({
        where: { id: data.profileId },
        select: { userId: true },
      });

      if (profile) {
        // Emit webhook event
        WebhookEventEmitter.emit(
          profile.userId,
          data.eventType === "profile_view" ? "profile_view" : "link_click",
          { id: event.id, ...data },
          {
            ipHash: data.ipAddress,
            device: data.deviceType,
            country: data.country,
            city: data.city,
            browser: data.browser,
            os: data.os,
          },
        ).catch((err) => console.error("Webhook emission failed:", err));
      }
    }

    return event.id;
  } catch (error) {
    console.error("Error tracking analytics event:", error);
    return "";
  }
}

// Get analytics dashboard data
export async function getAnalyticsDashboard(
  profileId: string,
  startDate: Date,
  endDate: Date,
): Promise<any> {
  try {
    // Get profile views and link clicks in date range
    const [totalViews, totalClicks, demographics, referrers, heatmaps] =
      await Promise.all([
        // Total profile views
        prisma.analyticsEvent.count({
          where: {
            profileId,
            eventType: "profile_view",
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),

        // Total link clicks
        prisma.analyticsEvent.count({
          where: {
            profileId,
            eventType: "link_click",
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),

        // Geographic and device demographics
        prisma.analyticsEvent.groupBy({
          by: ["country", "deviceType"],
          where: {
            profileId,
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          _count: {
            country: true,
          },
        }),

        // Referrer sources
        prisma.analyticsEvent.groupBy({
          by: ["referrer"],
          where: {
            profileId,
            eventType: "profile_view",
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          _count: {
            referrer: true,
          },
        }),

        // Link click heatmaps
        prisma.analyticsEvent.groupBy({
          by: ["linkId"],
          where: {
            profileId,
            eventType: "link_click",
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          _count: {
            linkId: true,
          },
        }),
      ]);

    // Process demographic data
    const countries = demographics.reduce((acc: any[], item) => {
      const existingCountry = acc.find(
        (country) => country.country === item.country,
      );
      if (existingCountry) {
        existingCountry.count += item._count.country;
      } else {
        acc.push({
          country: item.country,
          count: item._count.country,
        });
      }
      return acc;
    }, []);

    // Process device data
    const deviceCounts = demographics.reduce(
      (acc: any, item) => {
        if (item.deviceType) {
          acc[item.deviceType] =
            (acc[item.deviceType] || 0) + item._count.country;
        }
        return acc;
      },
      { mobile: 0, tablet: 0, desktop: 0 },
    );

    // Process referrers
    const referrerData = referrers
      .filter((item) => item.referrer)
      .map((item) => ({
        source: item.referrer,
        count: item._count.referrer,
      }));

    // Process heatmaps
    const linkHeatmaps = await Promise.all(
      heatmaps.map(async (heatmap) => {
        if (!heatmap.linkId) return null;

        const link = await prisma.link.findUnique({
          where: { id: heatmap.linkId },
          select: { title: true },
        });

        if (!link) return null;

        return {
          linkId: heatmap.linkId,
          title: link.title,
          clicks: heatmap._count.linkId,
        };
      }),
    );

    return {
      totalViews,
      totalClicks,
      demographics: {
        countries: countries.sort((a, b) => b.count - a.count).slice(0, 10), // Top 10 countries
        devices: deviceCounts,
      },
      referrers: referrerData,
      heatmaps: linkHeatmaps
        .filter(Boolean)
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10), // Top 10 links
    };
  } catch (error) {
    console.error("Error fetching analytics dashboard:", error);
    throw new Error("Failed to fetch analytics data");
  }
}

// Export analytics data as CSV
export async function exportAnalyticsData(
  profileId: string,
  startDate: Date,
  endDate: Date,
  dataType: "clicks" | "views" | "referrers" | "demographics",
): Promise<string> {
  try {
    let data: any[] = [];

    switch (dataType) {
      case "clicks":
        data = await prisma.analyticsEvent.findMany({
          where: {
            profileId,
            eventType: "link_click",
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            link: true,
          },
        });
        break;
      case "views":
        data = await prisma.analyticsEvent.findMany({
          where: {
            profileId,
            eventType: "profile_view",
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
        });
        break;
      case "referrers":
        data = await prisma.analyticsEvent.groupBy({
          by: ["referrer"],
          where: {
            profileId,
            eventType: "profile_view",
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          _count: {
            referrer: true,
          },
        });
        break;
      case "demographics":
        data = await prisma.analyticsEvent.groupBy({
          by: ["country", "city", "deviceType", "browser", "os"],
          where: {
            profileId,
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          _count: {
            country: true,
          },
        });
        break;
      default:
        throw new Error("Invalid data type for export");
    }

    // Convert to CSV format
    if (data.length === 0) {
      return "No data available";
    }

    // Get headers from the first data item
    const headers = Object.keys(data[0]).filter((key) => key !== "_count");
    let csvContent = headers.join(",") + "\n";

    // Add data rows
    data.forEach((item) => {
      const row = headers
        .map((header) => {
          let value = item[header];
          if (typeof value === "object" && value !== null) {
            value = JSON.stringify(value);
          } else if (value === null || value === undefined) {
            value = "";
          }
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",");
      csvContent += row + "\n";
    });

    return csvContent;
  } catch (error) {
    console.error("Error exporting analytics data:", error);
    throw new Error("Failed to export analytics data");
  }
}

// Process analytics event queue (for async processing)
export async function processAnalyticsQueue() {
  // In a real implementation, this would process events from a queue system like Redis
  // For now, we'll just return
  console.log("Processing analytics queue...");
  return true;
}
