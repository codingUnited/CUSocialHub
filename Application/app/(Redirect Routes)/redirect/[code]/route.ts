import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: any) {
    const url = request.nextUrl.searchParams.get("u");

    if (!url) {
        return new NextResponse("Invalid short link", { status: 400 });
    }

    return NextResponse.redirect(url);
}
