import { supabase } from "@/lib/providers/supabase";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { code: string } }
) {
    const { code } = params;

    // Fetch the original URL
    const { data, error } = await supabase
        .from("shortlinks")
        .select("redirect_url, visits")
        .eq("short_code", code)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Increment clicks + update last_clicked_at
    await supabase
        .from("shortlinks")
        .update({
            visits: data.visits + 1,
            last_clicked_at: new Date().toISOString(),
        })
        .eq("short_code", code);

    return NextResponse.redirect(data.redirect_url);
}
