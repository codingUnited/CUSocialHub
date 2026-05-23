import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: { code: string };
}

export const GET = async (req: NextRequest, { params }: Params) => {
    const url = req.nextUrl.searchParams.get("u");

    if (!url) {
        return new NextResponse("Invalid short link", { status: 400 });
    }

    return NextResponse.redirect(url);
};
