import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { isValidDomain } from '../../../lib/utils';

// GET /api/domains - Get all custom domains for a profile
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

    const domains = await prisma.customDomain.findMany({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ domains });
  } catch (error) {
    console.error('Error fetching custom domains:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/domains - Create a new custom domain
export async function POST(req: NextRequest) {
  try {
    const { profileId, domain } = await req.json();

    if (!profileId) {
      return NextResponse.json(
        { message: 'Profile ID is required' },
        { status: 400 }
      );
    }

    if (!domain || !isValidDomain(domain)) {
      return NextResponse.json(
        { message: 'Valid domain is required' },
        { status: 400 }
      );
    }

    // Check if domain is already taken by another profile
    const existingDomain = await prisma.customDomain.findUnique({
      where: { domain },
    });

    if (existingDomain) {
      return NextResponse.json(
        { message: 'Domain is already in use' },
        { status: 409 }
      );
    }

    // Generate a verification token
    const verifyToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Create the custom domain
    const newDomain = await prisma.customDomain.create({
      data: {
        profileId,
        domain,
        verifyToken,
        isVerified: false,
        sslEnabled: false,
      },
    });

    return NextResponse.json({ domain: newDomain }, { status: 201 });
  } catch (error) {
    console.error('Error creating custom domain:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/domains/[id] - Update custom domain settings
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domainId = searchParams.get('id');

    if (!domainId) {
      return NextResponse.json(
        { message: 'Domain ID is required' },
        { status: 400 }
      );
    }

    const { sslEnabled } = await req.json();

    const updatedDomain = await prisma.customDomain.update({
      where: { id: domainId },
      data: { sslEnabled },
    });

    return NextResponse.json({ domain: updatedDomain });
  } catch (error) {
    console.error('Error updating custom domain:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/domains/[id] - Delete a custom domain
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domainId = searchParams.get('id');

    if (!domainId) {
      return NextResponse.json(
        { message: 'Domain ID is required' },
        { status: 400 }
      );
    }

    await prisma.customDomain.delete({
      where: { id: domainId },
    });

    return NextResponse.json({ message: 'Domain deleted successfully' });
  } catch (error) {
    console.error('Error deleting custom domain:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}