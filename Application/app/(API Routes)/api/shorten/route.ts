import { NextRequest, NextResponse } from "next/server";
import { makeCode } from "@/app/lib/encodeURL";
import { supabase } from "@/app/lib/providers/supabase";
import { ShortenSchema } from "@/app/lib/schemas/shorten";


export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const parsed = ShortenSchema.safeParse(body);
        if (!parsed.success) {
            return new NextResponse("Invalid url", { status: 400 });
        }
        const { url } = parsed.data;
        const { data, error } = await supabase
            .from("CUSocialHub-ResourceLinks")
            .insert({ redirect_url: url })
            .select("short_code")
            .single();
        if (error) {
            console.error(error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
        const code = makeCode(url);
        const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/redirect/${data.short_code}`

        return NextResponse.json({ shortUrl });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
};
