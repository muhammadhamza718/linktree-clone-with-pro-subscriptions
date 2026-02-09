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
  variantId?: string; // For A/B testing
  eventType: "profile_view" | "link_click";
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  deviceType?: "mobile" | "tablet" | "desktop"; // Enforce specific types for device
  browser?: string;
  os?: string;
  timezoneOffset?: number;
}

// Interface for dashboard data return type
export interface AnalyticsDashboardData {
  totalViews: number;
  totalClicks: number;
  demographics: {
    countries: { country: string; count: number }[];
    devices: { mobile: number; tablet: number; desktop: number };
  };
  referrers: { source: string; count: number }[];
  heatmaps: { linkId: string; title: string; clicks: number }[];
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
        variantId: data.variantId,
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

    // If it's a link click with a variant, record it in the A/B test service
    if (data.eventType === "link_click" && data.variantId) {
      try {
        const { TrafficSplitter } =
          await import("../services/ab-testing/traffic-splitter");
        await TrafficSplitter.recordClick(data.variantId);
      } catch (err) {
        console.error("A/B click tracking failed:", err);
      }
    }

    // Trigger Webhook Event if profileId is present
    if (data.profileId) {
      await triggerWebhook(data, event.id);
    }

    return event.id;
  } catch (error) {
    console.error("Error tracking analytics event:", error);
    return "";
  }
}

// Helper to trigger webhooks separately
async function triggerWebhook(data: AnalyticsTrackData, eventId: string) {
  try {
    // We need the userId to trigger webhooks
    const profile = await prisma.profile.findUnique({
      where: { id: data.profileId },
      select: { userId: true },
    });

    if (profile) {
      // Emit webhook event
      await WebhookEventEmitter.emit(
        profile.userId,
        data.eventType === "profile_view" ? "profile_view" : "link_click",
        { id: eventId, ...data },
        {
          ipHash: data.ipAddress,
          device: data.deviceType || "unknown",
          country: data.country || "unknown",
          city: data.city || "unknown",
          browser: data.browser || "unknown",
          os: data.os || "unknown",
        },
      );
    }
  } catch (err) {
    console.error("Webhook emission failed:", err);
  }
}

// Get analytics dashboard data
export async function getAnalyticsDashboard(
  profileId: string,
  startDate: Date,
  endDate: Date,
): Promise<AnalyticsDashboardData> {
  try {
    // Define the date filter once
    const dateFilter = {
      gte: startDate,
      lte: endDate,
    };

    const countQuery = (eventType: string) => ({
      where: {
        profileId,
        eventType,
        timestamp: dateFilter,
      },
    });

    // Get profile views and link clicks in date range
    const [totalViews, totalClicks, demographics, referrers, heatmaps] =
      await Promise.all([
        // Total profile views
        prisma.analyticsEvent.count(countQuery("profile_view")),

        // Total link clicks
        prisma.analyticsEvent.count(countQuery("link_click")),

        // Geographic and device demographics
        prisma.analyticsEvent.groupBy({
          by: ["country", "deviceType"],
          where: {
            profileId,
            timestamp: dateFilter,
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
            timestamp: dateFilter,
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
            timestamp: dateFilter,
          },
          _count: {
            linkId: true,
          },
        }),
      ]);

    // Process demographic data
    interface CountryData {
      country: string;
      count: number;
    }
    const countriesMap = new Map<string, number>();

    demographics.forEach((item: any) => {
      if (item.country) {
        const currentCount = countriesMap.get(item.country) || 0;
        countriesMap.set(
          item.country,
          currentCount + (item._count.country || 0),
        );
      }
    });

    const countries: CountryData[] = Array.from(countriesMap.entries()).map(
      ([country, count]) => ({ country, count }),
    );

    // Process device data
    const deviceCounts = demographics.reduce(
      (acc: AnalyticsDashboardData["demographics"]["devices"], item: any) => {
        if (
          item.deviceType &&
          (item.deviceType === "mobile" ||
            item.deviceType === "tablet" ||
            item.deviceType === "desktop")
        ) {
          acc[item.deviceType] =
            (acc[item.deviceType] || 0) + (item._count.country || 0);
        }
        return acc;
      },
      {
        mobile: 0,
        tablet: 0,
        desktop: 0,
      } as AnalyticsDashboardData["demographics"]["devices"],
    );

    // Process referrers
    const referrerData = referrers
      .filter((item: any) => item.referrer)
      .map((item: any) => ({
        source: item.referrer as string,
        count: item._count.referrer || 0,
      }));

    // Process heatmaps
    const linkHeatmaps = await Promise.all(
      heatmaps.map(async (heatmap: any) => {
        if (!heatmap.linkId) return null;

        const link = await prisma.link.findUnique({
          where: { id: heatmap.linkId },
          select: { title: true },
        });

        if (!link) return null;

        return {
          linkId: heatmap.linkId,
          title: link.title,
          clicks: heatmap._count.linkId || 0,
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
        .filter(
          (item): item is { linkId: string; title: string; clicks: number } =>
            Boolean(item),
        )
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10), // Top 10 links
    };
  } catch (error) {
    console.error("Error fetching analytics dashboard:", error);
    throw new Error("Failed to fetch analytics data");
  }
}

// Process analytics event queue (for async processing)
export async function processAnalyticsQueue(): Promise<boolean> {
  // In a real implementation, this would process events from a queue system like Redis
  // For now, call the in-memory queue processor from analytics-queue if needed,
  // or simply return true as the queue handles itself.
  // We can import the flush function here if we wanted to trigger processing manually
  console.log(
    "Processing analytics queue... (handled by analytics-queue service)",
  );
  return true;
}
