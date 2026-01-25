import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { validateLink } from '../../../../lib/validations';

// PUT /api/links/schedule - Update link scheduling information
export async function PUT(req: NextRequest) {
  try {
    const { linkId, startDate, endDate, timezone } = await req.json();

    if (!linkId) {
      return NextResponse.json(
        { message: 'Link ID is required' },
        { status: 400 }
      );
    }

    // Validate the schedule data
    const scheduleData = {
      startDate: startDate || null,
      endDate: endDate || null,
      timezone: timezone || null,
    };

    // Update the link with scheduling information
    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: {
        startDate: scheduleData.startDate ? new Date(scheduleData.startDate) : null,
        endDate: scheduleData.endDate ? new Date(scheduleData.endDate) : null,
        timezone: scheduleData.timezone,
      },
    });

    return NextResponse.json({ link: updatedLink });
  } catch (error) {
    console.error('Error updating link schedule:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/links/schedule - Get scheduled links for a profile
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json(
        { message: 'Profile ID is required' },
        { status: 400 }
      );
    }

    // Get links with scheduling information for the profile
    const scheduledLinks = await prisma.link.findMany({
      where: {
        profileId,
        OR: [
          { startDate: { not: null } },
          { endDate: { not: null } },
        ],
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({ links: scheduledLinks });
  } catch (error) {
    console.error('Error fetching scheduled links:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}