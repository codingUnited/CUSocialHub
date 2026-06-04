// app/api/polls/[id]/vote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PollManager } from "@/lib/registries/polls/PollManager";

const manager = new PollManager();

// Vote on a poll option
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const { id } = await context.params;
    const { optionId } = await req.json();

    const cookieKey = `poll_${id}_option_${optionId}`;
    const cookieStore = await cookies();

    // Check if user already voted on this option
    if (cookieStore.get(cookieKey)) {
        return NextResponse.json(
            { success: false, error: "You already voted on this option." },
            { status: 400 }
        );
    }
    try {
        const poll = await manager.vote(id, optionId);
        // Mark this option as voted
        cookieStore.set(cookieKey, "true", {
            maxAge: 60 * 60 * 24 * 365, // 1 year
            httpOnly: true,
            sameSite: "lax",
        });
        return NextResponse.json({ success: true, poll });



    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";

        return NextResponse.json(
            { success: false, error: message },
            { status: 400 }
        );
    }
}