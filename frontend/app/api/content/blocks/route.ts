import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { validateRichContentBlock } from '../../../../lib/validations';

// GET /api/content/blocks - Get all rich content blocks for a profile
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

    const contentBlocks = await prisma.richContentBlock.findMany({
      where: { profileId },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json({ blocks: contentBlocks });
  } catch (error) {
    console.error('Error fetching rich content blocks:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/content/blocks - Create a new rich content block
export async function POST(req: NextRequest) {
  try {
    const { profileId, contentType, content, title, position, isVisible } = await req.json();

    if (!profileId) {
      return NextResponse.json(
        { message: 'Profile ID is required' },
        { status: 400 }
      );
    }

    if (!contentType || !content) {
      return NextResponse.json(
        { message: 'Content type and content are required' },
        { status: 400 }
      );
    }

    // Validate content block data
    const blockData = {
      profileId,
      contentType,
      content,
      title: title || '',
      position: position || 0,
      isVisible: isVisible !== undefined ? isVisible : true,
    };

    const validation = validateRichContentBlock(blockData);
    if (!validation.isValid) {
      return NextResponse.json(
        { message: 'Invalid content block data', errors: validation.errors },
        { status: 400 }
      );
    }

    // Create the rich content block
    const newBlock = await prisma.richContentBlock.create({
      data: {
        profileId,
        contentType,
        content,
        title: title || '',
        position: position || 0,
        isVisible: isVisible !== undefined ? isVisible : true,
      },
    });

    return NextResponse.json({ block: newBlock }, { status: 201 });
  } catch (error) {
    console.error('Error creating rich content block:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/content/blocks/[id] - Update a rich content block
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blockId = searchParams.get('id');

    if (!blockId) {
      return NextResponse.json(
        { message: 'Block ID is required' },
        { status: 400 }
      );
    }

    const { contentType, content, title, position, isVisible } = await req.json();

    // Prepare update data
    const updateData: any = {};
    if (contentType !== undefined) updateData.contentType = contentType;
    if (content !== undefined) updateData.content = content;
    if (title !== undefined) updateData.title = title;
    if (position !== undefined) updateData.position = position;
    if (isVisible !== undefined) updateData.isVisible = isVisible;

    // Update the rich content block
    const updatedBlock = await prisma.richContentBlock.update({
      where: { id: blockId },
      data: updateData,
    });

    return NextResponse.json({ block: updatedBlock });
  } catch (error) {
    console.error('Error updating rich content block:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/content/blocks/[id] - Delete a rich content block
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blockId = searchParams.get('id');

    if (!blockId) {
      return NextResponse.json(
        { message: 'Block ID is required' },
        { status: 400 }
      );
    }

    await prisma.richContentBlock.delete({
      where: { id: blockId },
    });

    return NextResponse.json({ message: 'Content block deleted successfully' });
  } catch (error) {
    console.error('Error deleting rich content block:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}