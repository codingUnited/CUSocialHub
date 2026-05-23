import { NextRequest, NextResponse } from "next/server";
import { makeCode } from "@/lib/encodeURL";


function shortenInMarkdown(text: string) {
    // Flattened the regex onto a single line so it compiles correctly
    return text.replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, (match, label, url) => {
        const code = makeCode(url);
        const short = `${process.env.NEXT_PUBLIC_BASE_URL}/redirect/${code}?u=${encodeURIComponent(url)}`;
        return `[${label}](${short})`;
    });
}

export const POST = async (req: NextRequest) => {

    const Resources = ["matlab"]
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    function jsonToEmbedFields(json: Record<string, any>) {
        const fields = [];

        for (const [key, value] of Object.entries(json)) {
            // Skip special keys handled separately
            if (["Title", "Overview", "Logo"].includes(key)) continue;

            // Convert arrays → bullet list
            if (Array.isArray(value)) {
                fields.push({
                    name: key,
                    value: shortenInMarkdown(value.join("\n")),
                });
            }

            // Convert strings → direct field
            else if (typeof value === "string") {
                fields.push({
                    name: key,
                    value: shortenInMarkdown(value)
                });
            }
        }

        return fields;
    }
    const webhookUrl = `${process.env.RESOURCESLIST_WEBHOOK_URL}?with_components=true&wait=true`;
    if (!webhookUrl) {
        return new NextResponse("Webhook URL not configured", { status: 500 });
    }
    for (const Resource of Resources) {
        // 1. Fetch JSON
        const jsonUrl = `https://raw.githubusercontent.com/codingUnited/Coding-United-Dev-Resources/main/languages/${Resource}.json`;
        const jsonRes = await fetch(jsonUrl);
        const jsonData = await jsonRes.json();

        // 2. Convert JSON → embed fields
        const embedFields = jsonToEmbedFields(jsonData);

        console.log("Webhook URL:", webhookUrl);
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
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            // 1. Extract the raw error message from Discord's response body
            const errorText = await response.text();

            let formattedError;
            try {
                // 2. Try to parse it as JSON so it looks clean in your server console
                const errorJson = JSON.parse(errorText);
                formattedError = JSON.stringify(errorJson, null, 2);
            } catch {
                // Fallback just in case Discord sends a raw HTML error (like a Cloudflare 502)
                formattedError = errorText;
            }

            // 3. Log the exact issue to your backend terminal
            console.error("🔴 Discord Webhook Error:", formattedError);

            // 4. Return the actual error reason to whatever triggered this API route
            return new NextResponse(`Discord API Error (${response.status}): ${formattedError}`, {
                status: response.status, // Pass along Discord's actual status code instead of a hardcoded 500
            });
        }
        await sleep(500);


    }
    return new NextResponse("Message(s) sent to Discord successfully", {
        status: 200,
    });

};