import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';

// GET /api/themes - Get all themes for current user
export async function GET(req: NextRequest) {
  try {
    // In a real implementation, we'd get the user from the session
    // For now, returning all themes for demonstration
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); // This would normally come from session

    if (!userId) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const themes = await prisma.theme.findMany({
      where: {
        OR: [
          { userId },
          { presetName: { not: null } }, // Include predefined themes
        ],
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ themes });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/themes - Create a new theme
export async function POST(req: NextRequest) {
  try {
    const { name, backgroundColor, textColor, linkColor, buttonStyle, buttonColor, fontFamily, fontSize, isLightMode, presetName } = await req.json();

    // In a real implementation, we'd get the user from the session
    // For now, we'll need to get the userId from somewhere
    const userId = "some-user-id"; // Would come from session

    if (!userId) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Create the theme
    const newTheme = await prisma.theme.create({
      data: {
        name,
        userId,
        backgroundColor: backgroundColor || null,
        textColor: textColor || null,
        linkColor: linkColor || null,
        buttonStyle: buttonStyle || 'rounded',
        buttonColor: buttonColor || 'solid',
        fontFamily: fontFamily || null,
        fontSize: fontSize || null,
        isLightMode: isLightMode !== undefined ? isLightMode : true,
        presetName: presetName || null,
      },
    });

    return NextResponse.json({ theme: newTheme }, { status: 201 });
  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/themes - Update the current theme
export async function PUT(req: NextRequest) {
  try {
    const { id, name, backgroundColor, textColor, linkColor, buttonStyle, buttonColor, fontFamily, fontSize, isLightMode } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: 'Theme ID is required' },
        { status: 400 }
      );
    }

    // Update the theme
    const updatedTheme = await prisma.theme.update({
      where: { id },
      data: {
        name,
        backgroundColor,
        textColor,
        linkColor,
        buttonStyle,
        buttonColor,
        fontFamily,
        fontSize,
        isLightMode,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ theme: updatedTheme });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}