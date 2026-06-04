// app/api/polls/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PollManager } from "@/lib/registries/polls/PollManager";



const manager = new PollManager();


// Get all polls
export async function GET() {
    const polls = await manager.getAllPolls();
    return NextResponse.json(polls);
}


// Create a new poll
export async function POST(req: NextRequest) {
    // const { key } = await req.json();

    // // if (key !== process.env.POLL_CREATION_KEY) {
    // //     return NextResponse.json(
    // //         { success: false, error: "Unauthorized poll creation." },
    // //         { status: 403 }
    // //     );
    // // }

    const body = await req.json();
    const created = await manager.createPoll(body);
    return NextResponse.json(created, { status: 201 });
}
