import { z } from "zod";

export const PollOptionSchema = z.object({
    id: z.string().nonempty("Option ID cannot be empty"),
    label: z.string().nonempty("Option label cannot be empty").nonoptional("Option label is required"),
    votes: z.number().int().nonnegative(),
    votedUsers: z.array(z.string()).optional()

});
// Optional: export inferred type
export type PollOptionData = z.infer<typeof PollOptionSchema>;