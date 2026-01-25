import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '../../../../../lib/db';

// PUT /api/links/[id]/pin - Update link pinning status
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { isPinned } = await req.json();

    if (typeof isPinned !== 'boolean') {
      return NextResponse.json(
        { message: 'isPinned must be a boolean' },
        { status: 400 }
      );
    }

    // In a real implementation, we'd verify the user owns this link
    // For now, we'll just update the link directly

    const updatedLink = await prisma.link.update({
      where: { id },
      data: { isPinned },
    });

    return NextResponse.json({ link: updatedLink });
  } catch (error) {
    console.error('Error updating link pinning status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/links/[id]/pin - Get link pinning status
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      return NextResponse.json(
        { message: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ isPinned: link.isPinned });
  } catch (error) {
    console.error('Error getting link pinning status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}