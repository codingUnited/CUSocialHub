import { z } from "zod"
import { PollOptionSchema } from "./PollOptionSchema";

export const PollSchema = z.object({
    id: z.string().nonempty("Poll ID cannot be empty").nonoptional("Poll ID is required"),
    title: z.string().nonempty("Poll title cannot be empty").nonoptional("Poll title is required"),
    description: z.string().nonempty("Poll description cannot be empty").nonoptional("Poll description is required"),
    options: z.array(PollOptionSchema),
    allowUserOptions: z.boolean(),
    startDate: z.date().nonoptional("Poll start date is required"),
    endDate: z.date().nonoptional("Poll end date is required"),
    status: z.enum(["scheduled", "open", "closed"]),
    timezone: z.string()
        .min(1, "Timezone is required")
        .refine(
            tz => Intl.supportedValuesOf("timeZone").includes(tz),
            "Invalid timezone"
        ),
    imageUrl: z.url("Poll image URL must be a valid URL").optional()
})
    .refine(data => data.allowUserOptions || data.options.length > 0, {
        message: "Poll must have at least one option if user options are not allowed"
    })
    .refine(data => data.startDate < data.endDate, {
        message: "Poll start date must be before end date",
    })
    .refine(data => data.startDate > new Date(), {
        message: "Poll start date must be in the future",
        path: ["startDate"]
    })
    .refine(data => data.endDate > new Date(), {
        message: "Poll end date must be in the future",
        path: ["endDate"]
    })
