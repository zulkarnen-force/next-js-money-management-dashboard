import { prismaClient } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const jobId = req.nextUrl.searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ status: "unauthorized" }, { status: 401 });
  }

  const job = await prismaClient.importJob.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    return NextResponse.json({ status: "idle" });
  }

  return NextResponse.json({
    status: job.status,
    ata: job.data,
    createdAt: job.createdAt,
  });
}
