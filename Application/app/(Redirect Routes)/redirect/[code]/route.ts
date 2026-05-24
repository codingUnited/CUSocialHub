import { supabase } from "@/app/lib/providers/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ code: string }> }
) {

    const { code } = await context.params;
    // Fetch the original URL
    const { data, error } = await supabase
        .from("CUSocialHub-ResourceLinks")
        .select("redirect_url, visits")
        .eq("short_code", code)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Increment clicks + update last_clicked_at
    await supabase
        .from("CUSocialHub-ResourceLinks")
        .update({
            visits: data.visits + 1,
            last_clicked_at: new Date().toISOString(),
        })
        .eq("short_code", code);

    return NextResponse.redirect(data.redirect_url);
}
