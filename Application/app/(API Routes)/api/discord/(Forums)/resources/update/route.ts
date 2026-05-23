import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const webhookUrl = `${process.env.RESOURCESLIST_WEBHOOK_URL}?with_components=true&wait=false`;
    if (!webhookUrl) {
        return new NextResponse("Webhook URL not configured", { status: 500 });
    }
    console.log("Webhook URL:", webhookUrl);
    const payload = {
        username: "CodingUnited - Board for Resource Review",
        thread_id: "1505047712863748107",
        thread_name: "test",
        content: `
    [test](https://www.example.com) -   Please review the resource and provide feedback.
        `,
        applied_tags: ["1458332329000046767", "1458898795050831973", "1458898831197474948", "1458894820381556959", "1505036337823088710"], // Example tag ID
        files: [{ image: { url: "https://github.com/codingUnited/Coding-United-Dev-Resources/blob/main/languages/logos/Assembly.png" } }],//update with placeholder image URL from raw github
        components: [
            // {
            //     type: 1,
            //     components: [
            //         {
            //             type: 2,
            //             style: 1,
            //             label: "1⭐",
            //             custom_id: "star_1_button",
            //         },
            //         {
            //             type: 2,
            //             style: 1,
            //             label: "2⭐",
            //             custom_id: "star_2_button",
            //         },
            //         {
            //             type: 2,
            //             style: 1,
            //             label: "3⭐",
            //             custom_id: "star_3_button",
            //         },
            //         {
            //             type: 2,
            //             style: 1,
            //             label: "4⭐",
            //             custom_id: "star_4_button",
            //         },
            //         {
            //             type: 2,
            //             style: 1,
            //             label: "5⭐",
            //             custom_id: "star_5_button",
            //         },
            //     ],
            // },
        ],
    };
    const response = await fetch(webhookUrl, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        return new NextResponse("Failed to send message to Discord: " + JSON.stringify(payload), {
            status: 500,
        });
    }
    return new NextResponse("Message sent to Discord successfully", {
        status: 200,
    });
};