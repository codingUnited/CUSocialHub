import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const GET = async () => {};
export const POST = async (req: NextRequest) => {
  const webhookUrl = `${process.env.CU_SOCIAL_MENTORS_WEBHOOK_URL}?with_components=true`;
  if (!webhookUrl) {
    return new NextResponse("Webhook URL not configured", { status: 500 });
  }
  // Load local file from /public
  const filePath = path.join(process.cwd(), "public", "MOKSE-3-180x46.webp");
  const fileBuffer = fs.readFileSync(filePath);
  // Create multipart form
  const form = new FormData();
  // JSON payload
  form.append(
    "payload_json",
    JSON.stringify({
      username: "CU - Board of Mentors",
      thread_id: null,
      thread_name: "Become a mentor",
      content: `
      **To become a Mentor:**
      1.) Read our Mentor Guidelines found here:
            @[Mentor Guidelines](https://codingunited.club/mentor-guidelines)
      2.) Start your application clicking the apply button or the link:
            @[Mentor Application](https://codingunited.club/mentor-application)
      3.) Await for Board Interview and Application Review. 
      4.) Upon approval, you will be added to the Board of Mentors.
      5.) Start mentoring and helping students grow their skills!!\n
      We look forward to having you on board as a mentor
      > **NOTE:**
            > - All applications have a 24-hour review period before being approved or denied. 
            > - If you have already applied, please wait for a response from the Board of Mentors. We will reach out to you via email or Discord DM. 
            > - If you are denied, you may reapply after 30 days or request an appeal. 
      `,
      applied_tags: ["1458546681896501433"], // Example tag ID
      files: [
        {
          image: {
            url: "https://raw.githubusercontent.com/codingUnited/CUSocialHub/main/Application/public/NewAvatar.png",
          },
        },
      ], //update with placeholder image URL from raw github
      components: [
        // {
        //   type: 1,
        //   components: [
        //     {
        //       type: 2,
        //       style: 1,
        //       label: "1⭐",
        //       custom_id: "star_1_button",
        //     },
        //     {
        //       type: 2,
        //       style: 1,
        //       label: "2⭐",
        //       custom_id: "star_2_button",
        //     },
        //     {
        //       type: 2,
        //       style: 1,
        //       label: "3⭐",
        //       custom_id: "star_3_button",
        //     },
        //     {
        //       type: 2,
        //       style: 1,
        //       label: "4⭐",
        //       custom_id: "star_4_button",
        //     },
        //     {
        //       type: 2,
        //       style: 1,
        //       label: "5⭐",
        //       custom_id: "star_5_button",
        //     },
        //   ],
        // },
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 4,
              label: "12👎",
              custom_id: "spacer_1",
              disabled: true,
            },
            {
              type: 2,
              style: 5,
              label: "Schedule Meeting",
              url: "https://calendly.com/codingunited/30min",
            },
            {
              type: 2,
              style: 3,
              label: "50👍",
              custom_id: "spacer_4",
              disabled: true,
            },
          ],
        },
      ],
    })
  );
  // Attach the file
  form.append("files[0]", new Blob([fileBuffer]), "NewAvatar.png");
  const payload = {};
  const response = await fetch(webhookUrl, {
    method: "POST",
    body: form,
  });
  if (!response.ok) {
    return new NextResponse("Failed to send message to Discord", {
      status: 500,
    });
  }
  return new NextResponse("Message sent to Discord successfully", {
    status: 200,
  });
};
export const PUT = async () => {};
export const PATCH = async () => {};
export const DELETE = async () => {};
export const HEAD = async () => {};
export const OPTIONS = async () => {};
