// app/api/polls/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PollManager } from "@/lib/registries/polls/PollManager";

const manager = new PollManager();

// Get poll by ID
export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const poll = await manager.getPollById(id);
    if (!poll) {
        return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }
    return NextResponse.json(poll);
}

// Update poll by ID
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const body = await req.json();
    const updated = await manager.updatePoll(id, body);
    return NextResponse.json(updated);
}

// Delete poll by ID
export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    await manager.deletePoll(id);
    return NextResponse.json({ success: true });
}
