import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';

// POST /api/analytics - Track profile views and link clicks
export async function POST(req: NextRequest) {
  try {
    const { profileId, linkId, eventType, ipAddress, userAgent, referrer } = await req.json();

    // Validate required fields
    if (!profileId && !linkId) {
      return NextResponse.json(
        { message: 'Either profileId or linkId is required' },
        { status: 400 }
      );
    }

    if (!eventType || !['profile_view', 'link_click'].includes(eventType)) {
      return NextResponse.json(
        { message: 'eventType is required and must be either profile_view or link_click' },
        { status: 400 }
      );
    }

    // Create analytics event
    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        profileId: profileId || null,
        linkId: linkId || null,
        eventType,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        referrer: referrer || null,
      },
    });

    return NextResponse.json({ event: analyticsEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating analytics event:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/analytics - Get analytics data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');
    const linkId = searchParams.get('linkId');
    const eventType = searchParams.get('eventType');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!profileId && !linkId) {
      return NextResponse.json(
        { message: 'Either profileId or linkId is required' },
        { status: 400 }
      );
    }

    // Build query filters
    const whereClause: any = {};
    if (profileId) whereClause.profileId = profileId;
    if (linkId) whereClause.linkId = linkId;
    if (eventType) whereClause.eventType = eventType;

    // Get analytics events
    const analyticsEvents = await prisma.analyticsEvent.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    // Get summary stats
    const totalViews = await prisma.analyticsEvent.count({
      where: {
        profileId,
        eventType: 'profile_view',
      },
    });

    const totalClicks = await prisma.analyticsEvent.count({
      where: {
        profileId,
        eventType: 'link_click',
      },
    });

    const summary = {
      totalViews,
      totalClicks,
      events: analyticsEvents,
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}