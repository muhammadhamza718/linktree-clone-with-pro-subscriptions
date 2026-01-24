import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/db';

// PUT /api/links/[id]/visibility - Toggle link visibility
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const linkId = params.id;

    if (!linkId) {
      return NextResponse.json(
        { message: 'Link ID is required' },
        { status: 400 }
      );
    }

    const { isVisible } = await req.json();

    if (typeof isVisible !== 'boolean') {
      return NextResponse.json(
        { message: 'isVisible must be a boolean' },
        { status: 400 }
      );
    }

    // Update the link visibility
    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: { isVisible },
    });

    return NextResponse.json({ link: updatedLink });
  } catch (error) {
    console.error('Error updating link visibility:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}