import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { validateLink } from '../../../lib/validations';

// GET /api/links - Get all links for current user
export async function GET(req: NextRequest) {
  try {
    // In a real implementation, we'd get the user from the session
    // For now, returning all links for demonstration
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId'); // This would normally come from session

    if (!profileId) {
      return NextResponse.json(
        { message: 'Profile not specified' },
        { status: 400 }
      );
    }

    const links = await prisma.link.findMany({
      where: {
        profileId: profileId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({ links });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/links - Create a new link
export async function POST(req: NextRequest) {
  try {
    const { title, url, linkType, thumbnail, icon, order, isVisible, isFeatured, githubRepo } = await req.json();

    // In a real implementation, we'd get the user from the session
    // For now, we'll need to get the profileId from the request
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json(
        { message: 'Profile not specified' },
        { status: 400 }
      );
    }

    // Validate the link data
    const linkData = {
      title,
      url,
      linkType,
      order,
      isVisible,
    };

    const validation = validateLink(linkData);
    if (!validation.isValid) {
      return NextResponse.json(
        { message: 'Invalid link data', errors: validation.errors },
        { status: 400 }
      );
    }

    // Create the link
    const newLink = await prisma.link.create({
      data: {
        profileId,
        title,
        url,
        linkType: linkType || 'website',
        thumbnail: thumbnail || null,
        icon: icon || null,
        order: order || 0,
        isVisible: isVisible !== undefined ? isVisible : true,
        isFeatured: isFeatured || false,
        githubRepo: githubRepo || null,
      },
    });

    return NextResponse.json({ link: newLink }, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}