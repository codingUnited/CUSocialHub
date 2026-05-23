import { NextRequest, NextResponse } from "next/server";
import { makeCode } from "@/lib/encodeURL";

export const POST = async (req: NextRequest) => {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
        return new NextResponse("Missing url", { status: 400 });
    }

    const code = makeCode(url);
    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/redirect/${code}?u=${encodeURIComponent(
        url
    )}`;

    return NextResponse.json({ shortUrl });
};
