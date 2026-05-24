import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
        .from("CUSocialHub-ResourceLinks")
        .select("*")
        .eq("short_code", "k85bkes1");

    console.log("DEBUG:", data, error);

    return NextResponse.json({ data, error });
}
