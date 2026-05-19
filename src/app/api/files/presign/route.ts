import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { S3_BUCKET, buildFileKey, isS3Configured, presignUpload } from "@/lib/s3";

const Body = z.object({
  projectId: z.string().min(1),
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1).max(200),
  sizeBytes: z.number().int().nonnegative().max(500 * 1024 * 1024), // 500MB max
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isS3Configured()) {
    return NextResponse.json(
      { error: "S3 is not configured on this server." },
      { status: 500 }
    );
  }

  const json = await request.json().catch(() => null);
  const parse = Body.safeParse(json);
  if (!parse.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parse.error.issues },
      { status: 400 }
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: parse.data.projectId },
    select: { id: true },
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const key = buildFileKey(parse.data.projectId, parse.data.filename);
  const url = await presignUpload(key, parse.data.contentType);

  return NextResponse.json({
    url,
    key,
    bucket: S3_BUCKET,
  });
}
