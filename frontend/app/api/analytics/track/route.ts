import { NextRequest, NextResponse } from 'next/server';
import { trackAnalyticsEvent } from '../../../lib/analytics';
import { isValidUrl, isValidEmail } from '../../../lib/utils';

// POST /api/analytics/track - Track an analytics event
export async function POST(req: NextRequest) {
  try {
    const { profileId, linkId, eventType, ipAddress, userAgent, referrer, country, city, deviceType, browser, os, timezoneOffset } = await req.json();

    // Validate required fields
    if (!eventType || !['profile_view', 'link_click'].includes(eventType)) {
      return NextResponse.json(
        { message: 'eventType is required and must be either "profile_view" or "link_click"' },
        { status: 400 }
      );
    }

    if (profileId && typeof profileId !== 'string') {
      return NextResponse.json(
        { message: 'profileId must be a string if provided' },
        { status: 400 }
      );
    }

    if (linkId && typeof linkId !== 'string') {
      return NextResponse.json(
        { message: 'linkId must be a string if provided' },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (ipAddress && typeof ipAddress !== 'string') {
      return NextResponse.json(
        { message: 'ipAddress must be a string' },
        { status: 400 }
      );
    }

    if (userAgent && typeof userAgent !== 'string') {
      return NextResponse.json(
        { message: 'userAgent must be a string' },
        { status: 400 }
      );
    }

    if (referrer && typeof referrer !== 'string') {
      return NextResponse.json(
        { message: 'referrer must be a string' },
        { status: 400 }
      );
    }

    if (country && typeof country !== 'string') {
      return NextResponse.json(
        { message: 'country must be a string' },
        { status: 400 }
      );
    }

    if (city && typeof city !== 'string') {
      return NextResponse.json(
        { message: 'city must be a string' },
        { status: 400 }
      );
    }

    if (deviceType && !['mobile', 'tablet', 'desktop'].includes(deviceType)) {
      return NextResponse.json(
        { message: 'deviceType must be one of "mobile", "tablet", or "desktop"' },
        { status: 400 }
      );
    }

    if (browser && typeof browser !== 'string') {
      return NextResponse.json(
        { message: 'browser must be a string' },
        { status: 400 }
      );
    }

    if (os && typeof os !== 'string') {
      return NextResponse.json(
        { message: 'os must be a string' },
        { status: 400 }
      );
    }

    if (timezoneOffset && typeof timezoneOffset !== 'number') {
      return NextResponse.json(
        { message: 'timezoneOffset must be a number' },
        { status: 400 }
      );
    }

    // Track the analytics event
    const eventId = await trackAnalyticsEvent({
      profileId,
      linkId,
      eventType,
      ipAddress,
      userAgent,
      referrer,
      country,
      city,
      deviceType: deviceType as 'mobile' | 'tablet' | 'desktop',
      browser,
      os,
      timezoneOffset,
    });

    return NextResponse.json({
      message: 'Analytics event tracked successfully',
      eventId,
      accepted: true
    }, { status: 202 }); // 202 Accepted - event received but processing asynchronously
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/analytics/dashboard - Get analytics dashboard data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    if (!profileId) {
      return NextResponse.json(
        { message: 'profileId is required' },
        { status: 400 }
      );
    }

    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { message: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { message: 'startDate and endDate must be valid dates' },
        { status: 400 }
      );
    }

    // In a real implementation, we would fetch from the analytics service
    // For now, returning mock data
    const analyticsData = {
      demographics: {
        countries: [
          { country: 'United States', count: 1240 },
          { country: 'Canada', count: 890 },
          { country: 'United Kingdom', count: 760 },
          { country: 'Germany', count: 650 },
          { country: 'India', count: 1200 },
        ],
        devices: {
          mobile: 65,
          tablet: 15,
          desktop: 20,
        },
      },
      heatmaps: [
        { linkId: 'link1', title: 'Portfolio', clicks: 1200, percentage: 35 },
        { linkId: 'link2', title: 'GitHub', clicks: 950, percentage: 28 },
        { linkId: 'link3', title: 'LinkedIn', clicks: 650, percentage: 19 },
        { linkId: 'link4', title: 'Twitter', clicks: 450, percentage: 13 },
        { linkId: 'link5', title: 'Resume', clicks: 180, percentage: 5 },
      ],
      referrers: [
        { source: 'Direct', count: 1500 },
        { source: 'Google', count: 890 },
        { source: 'Social Media', count: 650 },
        { source: 'Email', count: 420 },
      ],
      totalViews: 3430,
      totalClicks: 3430,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}