import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<any> }
) {
  const params = await context.params;

  console.log("LIVE PARAMS:", params);

  return NextResponse.json({
    received: params,
    note: "This shows exactly what Next.js is passing into your route."
  });
}
