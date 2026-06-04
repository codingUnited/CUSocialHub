import { NextRequest, NextResponse } from "next/server";
import { PollManager } from "@/lib/registries/polls/PollManager";
import { StreamingLinkSchema } from "@/lib/validators/streamingLinks";

const manager = new PollManager();

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const { title, link } = await req.json();

    if (!title || title.trim().length === 0) {
        return NextResponse.json(
            { success: false, error: "Title cannot be empty." },
            { status: 400 }
        );
    }

    const parsed = StreamingLinkSchema.safeParse(link);
    if (!parsed.success) {
        return NextResponse.json(
            { success: false, error: parsed.error.issues[0].message },
            { status: 400 }
        );
    }

    try {
        // Store the title as the label
        const poll = await manager.addOption(id, title.trim());

        // DO NOT MODIFY poll.options[*].label
        // Instead return the link separately for UI use
        return NextResponse.json({
            success: true,
            poll,
            link
        });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 400 }
        );
    }
}
