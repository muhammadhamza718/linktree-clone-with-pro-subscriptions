import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth/better-auth";
import { AutoPromoter } from "@/services/ab-testing/auto-promoter";

/**
 * GET: Fetch specific A/B test and its variants
 * PATCH: Update A/B test (status, etc)
 * DELETE: Remove A/B test
 */

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const test = await prisma.aBTest.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        variants: true,
      },
    });

    if (!test)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Optionally check for promotion if running
    if (test.status === "running") {
      await AutoPromoter.checkAndPromote(test.id).catch(console.error);
    }

    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { status, testName } = await req.json();

    const result = await prisma.aBTest.updateMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        ...(status && { status }),
        ...(testName && { testName }),
        ...(status === "completed" && { endedAt: new Date() }),
      },
    });

    if (result.count === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await prisma.aBTest.deleteMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (result.count === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
