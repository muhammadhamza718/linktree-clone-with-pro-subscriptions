import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { validateLink } from '../../../../lib/validations';

// PUT /api/links/[id] - Update a link
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const linkId = params.id;

    if (!linkId) {
      return NextResponse.json(
        { message: 'Link ID is required' },
        { status: 400 }
      );
    }

    const { title, url, linkType, thumbnail, icon, order, isVisible, isFeatured, githubRepo } = await req.json();

    // Validate the link data if provided
    if (title || url) {
      const linkData = {
        title: title || '',
        url: url || '',
        linkType: linkType || 'website',
        order: order || 0,
        isVisible: isVisible !== undefined ? isVisible : true,
      };

      // Only validate if we have required fields
      if (title || url) {
        const validation = validateLink(linkData);
        if (!validation.isValid) {
          return NextResponse.json(
            { message: 'Invalid link data', errors: validation.errors },
            { status: 400 }
          );
        }
      }
    }

    // Update the link
    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: {
        title,
        url,
        linkType,
        thumbnail,
        icon,
        order,
        isVisible,
        isFeatured,
        githubRepo,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ link: updatedLink });
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/links/[id] - Delete a link
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const linkId = params.id;

    if (!linkId) {
      return NextResponse.json(
        { message: 'Link ID is required' },
        { status: 400 }
      );
    }

    // Delete the link
    await prisma.link.delete({
      where: { id: linkId },
    });

    return NextResponse.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}