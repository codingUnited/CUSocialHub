import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const webhookUrl = `https://discord.com/api/webhooks/1458667755548049510/jcTsk7MysTN1wNFjNf4C-KDkLmqpUqSqkzwthlc_ABu73OHUMxDek7bXt7d9MBEuf8Y2?with_components=true&wait=false`;
    if (!webhookUrl) {
        return new NextResponse("Webhook URL not configured", { status: 500 });
    }
    console.log("Webhook URL:", webhookUrl);
    const payload = {
        username: "CodingUnited - Board of Mentor Reviews",
        thread_id: null,
        thread_name: "test",
        content: "Hello from CUSocialHub!",
        applied_tags: ["1458546681896501433"], // Example tag ID
        files: [{ image: { url: "/NewAvatar.png" } }],//update with placeholder image URL from raw github
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
        method: "POST",
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