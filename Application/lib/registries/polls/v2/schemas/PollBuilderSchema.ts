import { z } from "zod";
import { PollOptionSchema } from "./PollOptionSchema";

export const PollBuilderSchema = z.object({
    title: z.string(),
    description: z.string(),
    options: z.array(PollOptionSchema).default([]), // Allow empty array if user options are allowed
    allowUserOptions: z
        .boolean()
        .default(false),
    startDate: z
        .coerce.date(),
    endDate: z
        .coerce.date(),
    status: z
        .enum(["scheduled", "open", "closed"])
        .default("scheduled"),
    timezone: z.string()
        .min(1, "Timezone is required")
        .refine(
            tz => Intl.supportedValuesOf("timeZone").includes(tz),
            "Invalid timezone"
        ),
    imageUrl: z
        .url()
        .optional(),
    type: z.enum(["T/F", "single", "multi", "typed"]).default("single")

});
