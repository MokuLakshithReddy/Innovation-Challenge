import { NextResponse } from "next/server";
import { MOCK_DIFFS } from "@/data/pipelineData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const diffId = searchParams.get("diffId");

  if (diffId) {
    const matched = MOCK_DIFFS.find((d) => d.id === diffId);
    if (matched) {
      return NextResponse.json({ status: "success", diff: matched });
    }
    return NextResponse.json({ status: "error", message: "Diff not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: "success",
    timestamp: new Date().toISOString(),
    totalDiffs: MOCK_DIFFS.length,
    diffs: MOCK_DIFFS,
  });
}
