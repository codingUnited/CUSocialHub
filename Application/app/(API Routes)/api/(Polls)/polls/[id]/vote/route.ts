// app/api/polls/[id]/vote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PollManager } from "@/lib/registries/polls/PollManager";

const manager = new PollManager();

// Vote on a poll option
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const { optionId } = await req.json();

    const updated = await manager.vote(id, optionId);
    return NextResponse.json(updated);
}