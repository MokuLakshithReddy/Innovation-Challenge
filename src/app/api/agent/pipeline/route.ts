import { NextResponse } from "next/server";
import { MOCK_PIPELINE_STAGES, MOCK_PIPELINE_LOGS } from "@/data/pipelineData";
import { MOCK_COMMITS } from "@/data/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const commitHash = searchParams.get("commit") || "c4a89f2";

  const commit = MOCK_COMMITS.find((c) => c.hash === commitHash) || MOCK_COMMITS[0];

  return NextResponse.json({
    status: "success",
    timestamp: new Date().toISOString(),
    commit,
    stages: MOCK_PIPELINE_STAGES,
    logs: MOCK_PIPELINE_LOGS,
    summary: {
      totalDuration: "3.8s",
      stagesPassed: 5,
      complianceScore: "100%",
      openApiVersion: "3.1.0",
    },
  });
}
