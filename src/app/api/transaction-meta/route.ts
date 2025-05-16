import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // 'income' or 'outcome'

    // Fetch all required metadata
    const [subcategories, transactionTypes] = await Promise.all([
      prismaClient.subcategory.findMany({
        where: {
          userId: session.user.id,
          category: {
            userId: session.user.id,
            ...(type ? { type } : {}),
          },
        },
        include: { category: true },
      }),
      prismaClient.transactionType.findMany({
        where: {
          userId: session.user.id,
          ...(type ? { type } : {}), // Filter by type if provided
        },
      }),
    ]);

    return NextResponse.json({
      subcategories,
      transactionTypes,
    });
  } catch (error) {
    console.error("Error fetching transaction metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction metadata" },
      { status: 500 }
    );
  }
}
