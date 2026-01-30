import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth/better-auth";

/**
 * GET: List all A/B tests for user
 * POST: Create a new A/B test
 */
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const tests = await prisma.aBTest.findMany({
      where: { userId: session.user.id },
      include: {
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tests);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { testName, linkId, variants } = await req.json();

    if (!testName || !linkId || !variants || !Array.isArray(variants)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create test and variants in a transaction
    const test = await prisma.aBTest.create({
      data: {
        userId: session.user.id,
        testName,
        status: "running",
        startedAt: new Date(),
        variants: {
          create: variants.map((v: any) => ({
            linkId,
            variantName: v.name,
            title: v.title,
            trafficSplitPercent: v.split,
          })),
        },
      },
      include: { variants: true },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error("Error creating A/B test:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
