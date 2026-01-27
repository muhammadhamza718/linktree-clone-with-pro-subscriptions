import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/db';
import { validateContactForm } from '../../../../../lib/validations';

// POST /api/content/form/submit - Handle contact form submissions
export async function POST(req: NextRequest) {
  try {
    const { profileId, formId, name, email, message } = await req.json();

    if (!profileId) {
      return NextResponse.json(
        { message: 'Profile ID is required' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      );
    }

    // Validate form data
    const formData = { name, email, message };
    const validation = validateContactForm(formData);

    if (!validation.isValid) {
      return NextResponse.json(
        { message: 'Invalid form data', errors: validation.errors },
        { status: 400 }
      );
    }

    // Create contact submission in the database
    const submission = await prisma.contactSubmission.create({
      data: {
        profileId,
        formId: formId || null,
        name: name || null,
        email: email || null,
        message,
      },
    });

    // In a real implementation, you would also:
    // - Send an email notification to the profile owner
    // - Apply anti-spam measures (rate limiting, CAPTCHA verification, etc.)
    // - Possibly store additional metadata (IP address, user agent, etc.)

    return NextResponse.json({
      message: 'Form submitted successfully',
      submissionId: submission.id
    }, { status: 201 });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}