import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/providers/supabase";
import { makeCode } from "@/lib/encodeURL";

async function getOrCreateShortLink(url: string) {
    const code = makeCode(url);

    // 1. Check if URL already exists
    const { data: existing } = await supabase
        .from("CUSocialHub-ResourceLinks")
        .select("short_code")
        .eq("short_code", code)
        .maybeSingle();

    if (existing) {
        return existing.short_code;
    }

    // 2. Insert new short link (Supabase auto-generates code)
    const { data, error } = await supabase
        .from("CUSocialHub-ResourceLinks")
        .insert({ redirect_url: url, short_code: code })
        .select("short_code")
        .single();

    if (error) {
        console.error("Supabase insert error:", error);
        throw new Error("Failed to create short link");
    }

    return code;
}
function markRawUrls(text: string) {
    return text.replace(/(?<!PROCESSING:)(https?:\/\/[^\s\)\]\}\,;:]+)(?=[\s\)\]\}\,;:]|$)/g, (url) => {
        return `PROCESSING_RAW:${url}`;
    });
}

function shortenInMarkdown(text: string) {
    // Flattened the regex onto a single line so it compiles correctly
    return text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
        (match, label, url) => {
            return `[${label}](PROCESSING:${url})`;
        });
}
async function finalizeShortLinks(text: string, resourceName: string) {
    // 1. COLLECT UNIQUE URLS FIRST
    // A Map automatically deduplicates keys. If a URL appears 10 times, 
    // it only takes up one slot, saving us 9 database calls.
    const urlMap = new Map<string, string>();

    // Note: Removed the space after PROCESSING: to match your shortenInMarkdown output
    const mdRegex = /\[([^\]]+)\]\(PROCESSING:(https?:\/\/[^\s)]+)\)/g;
    const rawRegex = /PROCESSING_RAW:(https?:\/\/[^\s\)\]\}\,;:]+)(?=[\s\)\]\}\,;:]|$)/g;

    let mdMatch;
    while ((mdMatch = mdRegex.exec(text)) !== null) {
        urlMap.set(mdMatch[2], ""); // match[2] is the URL
    }

    let rawMatch;
    while ((rawMatch = rawRegex.exec(text)) !== null) {
        urlMap.set(rawMatch[1], ""); // match[1] is the URL
    }

    // 2. FETCH SHORT LINKS (ONCE PER UNIQUE URL)
    let inserted = 0;
    let reused = 0;

    for (const url of urlMap.keys()) {
        const code = await getOrCreateShortLink(url);

        // Check existence for your logging metrics
        const { data: exists } = await supabase
            .from("CUSocialHub-ResourceLinks")
            .select("short_code")
            .eq("short_code", code)
            .maybeSingle();

        if (exists) reused++;
        else inserted++;

        // Store the resolved short code in our dictionary
        urlMap.set(url, code);
    }

    // 3. SAFE GLOBAL REPLACE
    // By passing a replacer function to .replace(), JavaScript safely processes 
    // the entire string in one pass, resolving exact indices without overlap.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    let result = text.replace(mdRegex, (match, label, url) => {
        const code = urlMap.get(url);
        return `[${label}](${baseUrl}/redirect/${code})`;
    });

    result = result.replace(rawRegex, (match, url) => {
        const code = urlMap.get(url);
        return `${baseUrl}/redirect/${code}`;
    });

    console.log(`[${resourceName}] Found ${urlMap.size} unique URLs`);
    console.log(`[${resourceName}] Inserted ${inserted} | Reused ${reused}`);

    return result;
}

export const POST = async (req: NextRequest) => {

    // const Resources = ["assembly", "c", "cpp", "csharp", "go", "java", "kotlin", "php", "python", "r", "ruby", "rust", "sql", "swift", "typescript", "visualbasic"]
    const Resources = ["matlab"]
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    async function jsonToEmbedFields(json: Record<string, any>) {

        const fields = [];

        for (const [key, value] of Object.entries(json)) {

            // Skip special keys handled separately
            if (["Title", "Overview", "Logo"].includes(key)) continue;

            // Convert arrays → bullet list
            if (Array.isArray(value)) {
                console.log("=== ORIGINAL ===");
                console.log(value.join("\n"));
                const raw = markRawUrls(shortenInMarkdown(value.join("\n")));
                console.log("=== AFTER shortenInMarkdown ===");
                console.log(shortenInMarkdown(value.join("\n")));
                console.log("=== AFTER markRawUrls ===");
                console.log(markRawUrls(shortenInMarkdown(value.join("\n"))));
                const final = await finalizeShortLinks(raw, json.Title);
                console.log("=== AFTER finalizeShortLinks ===");
                console.log(final);
                fields.push({
                    name: key,
                    value: final,
                });
            }

            // Convert strings → direct field
            else if (typeof value === "string") {
                const raw = markRawUrls(shortenInMarkdown(value));
                const final = await finalizeShortLinks(raw, json.Title);
                fields.push({
                    name: key,
                    value: final
                });
            }

            console.log(`[${json.Title}] Done.`);
        }
        return fields;
    }
    const webhookUrl = `${process.env.RESOURCESLIST_WEBHOOK_URL}?with_components=true&wait=true`;
    if (!webhookUrl) {
        return new NextResponse("Webhook URL not configured", { status: 500 });
    }
    for (const Resource of Resources) {
        try {
            console.log(`\n===== Processing ${Resource} =====`);
            // 1. Fetch JSON
            const jsonUrl = `https://raw.githubusercontent.com/codingUnited/Coding-United-Dev-Resources/main/languages/${Resource}.json`;
            const jsonRes = await fetch(jsonUrl);
            if (!jsonRes.ok) {
                console.error(`[${Resource}] Failed to fetch JSON: ${jsonRes.status}`);
                continue; // skip to next language
            }
            const jsonData = await jsonRes.json();

            // 2. Convert JSON → embed fields
            let embedFields;
            try {
                embedFields = await jsonToEmbedFields(jsonData);
            } catch (err) {
                console.error(`[${Resource}] Error in jsonToEmbedFields:`, err);
                continue; // skip to next language
            }
            const payload = {
                username: "CU - Code Space Resource Curator",
                //update with placeholder image URL from raw github

                thread_name: `${jsonData.Title} Language Resources`,
                applied_tags: ["1458332329000046767", "1458898795050831973", "1458894820381556959", "1505036337823088710", "1505036419062698106"], // Example tag ID
                content: jsonData.Overview,

                embeds: [
                    {
                        thumbnail: {
                            url: `${jsonData.Logo}`,
                            height: 500,
                            width: 500
                        }, fields: embedFields
                    },
                ],
            };
            // 4. Send to Discord
            try {
                const response = await fetch(webhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }); if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`[${Resource}] Discord Error:`, errorText);
                    continue; // skip to next language
                }
            } catch (err) {
                console.error(`[${Resource}] Discord request failed:`, err);
                continue; // skip to next language
            }

            console.log(`[${Resource}] Successfully posted.`);
            await sleep(310);

        } catch (err) {
            console.error(`[${Resource}] Unexpected error:`, err);
            continue; // ALWAYS continue to next language
        }
    }
    return new NextResponse("Completed processing all languages (some may have failed).", {
        status: 200,
    });
}