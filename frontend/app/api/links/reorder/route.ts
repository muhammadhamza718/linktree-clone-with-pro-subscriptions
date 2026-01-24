import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

// PUT /api/links/reorder - Reorder links
export async function PUT(req: NextRequest) {
  try {
    const { linkOrder } = await req.json(); // Array of objects with id and order properties

    if (!Array.isArray(linkOrder)) {
      return NextResponse.json(
        { message: 'Invalid linkOrder format' },
        { status: 400 }
      );
    }

    // Validate the link order data
    for (const item of linkOrder) {
      if (!item.id || typeof item.order !== 'number') {
        return NextResponse.json(
          { message: 'Each link order item must have id and order properties' },
          { status: 400 }
        );
      }
    }

    // Use a transaction to update all links atomically
    await prisma.$transaction(
      linkOrder.map((item) =>
        prisma.link.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ message: 'Links reordered successfully' });
  } catch (error) {
    console.error('Error reordering links:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}