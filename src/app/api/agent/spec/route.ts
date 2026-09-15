import { NextResponse } from "next/server";
import { MOCK_OPENAPI_SPEC } from "@/data/pipelineData";

export async function GET() {
  return NextResponse.json(MOCK_OPENAPI_SPEC, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Agent-Generator": "DocPulse-AST-v2.4",
    },
  });
}
