import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

// GET /api/themes/current - Get the current theme for the user
export async function GET(req: NextRequest) {
  try {
    // In a real implementation, we'd get the user from the session
    // For now, using a placeholder userId
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId'); // This would normally come from session

    if (!profileId) {
      return NextResponse.json(
        { message: 'Profile not specified' },
        { status: 400 }
      );
    }

    // Get the profile to find its themeId
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { themeId: true }
    });

    if (!profile || !profile.themeId) {
      // Return default theme if no theme is set
      return NextResponse.json({
        theme: {
          id: 'default',
          name: 'Default Theme',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          linkColor: '#3b82f6',
          buttonStyle: 'rounded',
          buttonColor: 'solid',
          fontFamily: 'system-ui',
          fontSize: 'medium',
          isLightMode: true,
        }
      });
    }

    // Get the specific theme
    const theme = await prisma.theme.findUnique({
      where: { id: profile.themeId },
    });

    if (!theme) {
      // Return default theme if specified theme doesn't exist
      return NextResponse.json({
        theme: {
          id: 'default',
          name: 'Default Theme',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          linkColor: '#3b82f6',
          buttonStyle: 'rounded',
          buttonColor: 'solid',
          fontFamily: 'system-ui',
          fontSize: 'medium',
          isLightMode: true,
        }
      });
    }

    return NextResponse.json({ theme });
  } catch (error) {
    console.error('Error fetching current theme:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}