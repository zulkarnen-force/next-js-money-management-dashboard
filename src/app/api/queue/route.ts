// app/api/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prismaClient } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  console.log( { userId,
      data,
      status: "pending"})

  const job = await prismaClient.importJob.create({
    data: {
      userId,
      data,
      status: "pending",
    },
  });

  return NextResponse.json({ jobId: job.id });
}
