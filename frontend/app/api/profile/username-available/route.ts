import { NextRequest, NextResponse } from 'next/server';
import { isValidUsername } from '../../../../lib/utils';
import prisma from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    // Validate username format
    if (!isValidUsername(username)) {
      return NextResponse.json(
        {
          available: false,
          message: 'Username must be 3-30 characters and contain only letters, numbers, and hyphens'
        },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const existingProfile = await prisma.profile.findUnique({
      where: { username },
    });

    const isAvailable = !existingProfile;

    return NextResponse.json({
      available: isAvailable,
      message: isAvailable ? 'Username is available' : 'Username is already taken'
    });
  } catch (error) {
    console.error('Error checking username availability:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}