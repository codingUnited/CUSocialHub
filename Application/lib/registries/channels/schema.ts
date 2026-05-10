import { z } from "zod";

// Shared enums
const slowModeEnum = z.union([
    z.literal("Off"),
    z.literal(5),
    z.literal(10),
    z.literal(15),
    z.literal(30),
]);

const hideActivityEnum = z.union([
    z.literal("1 Hour"),
    z.literal("24 Hours"),
    z.literal("3 Days"),
    z.literal("1 Week"),
]);

// User limit: 0 (unlimited) or 1–99
const userLimitSchema = z
    .number()
    .int()
    .min(0)
    .max(99)
    .refine((n) => n === 0 || (n >= 1 && n <= 99), {
        message: "userLimit must be 0 or between 1 and 99",
    });

// Base schema shared by all channels
const BaseChannelSchema = {
    name: z.string().min(1, "Name is required"),
    type: z.enum(["Text", "Voice", "Forum", "Announcement", "Stage"]),
};

// Discriminated union
export const ChannelSchema = z.discriminatedUnion("type", [
    // TEXT CHANNEL
    z.object({
        ...BaseChannelSchema,
        type: z.literal("Text"),
        private: z.boolean().optional(),
        topic: z.string().optional(),
        slowModeDelay: slowModeEnum.optional(),
        ageRestriction: z.boolean().optional(),
        announcementsFeed: z.boolean().optional(),
        hideActivity: hideActivityEnum.optional(),
    }),

    // VOICE CHANNEL
    z.object({
        ...BaseChannelSchema,
        type: z.literal("Voice"),
        private: z.boolean().optional(),
        slowModeDelay: slowModeEnum.optional(),
        ageRestriction: z.boolean().optional(),
        userLimit: userLimitSchema.optional(),
    }),

    // FORUM CHANNEL
    z.object({
        ...BaseChannelSchema,
        type: z.literal("Forum"),
        private: z.boolean().optional(),
        topic: z.string().optional(),
        tags: z.array(z.string()).optional(),
        tagsRequired: z.boolean().optional(),
        defaultReactionEmoji: z.string().optional(),
        slowModePostDelay: slowModeEnum.optional(),
        slowModeMessageDelay: slowModeEnum.optional(),
        defaultLayout: z.enum(["Gallery", "List"]).optional(),
        sortOrder: z.enum(["Creation", "Recent"]).optional(),
        tagMatching: z.enum(["Match All", "Match Some"]).optional(),
        ageRestriction: z.boolean().optional(),
        hideActivity: hideActivityEnum.optional(),
    }),

    // ANNOUNCEMENT CHANNEL
    z.object({
        ...BaseChannelSchema,
        type: z.literal("Announcement"),
        topic: z.string().optional(),
        ageRestriction: z.boolean().optional(),
        announcementsFeed: z.boolean().optional(),
        hideActivity: hideActivityEnum.optional(),
    }),

    // STAGE CHANNEL
    z.object({
        ...BaseChannelSchema,
        type: z.literal("Stage"),
        slowModeDelay: slowModeEnum.optional(),
        ageRestriction: z.boolean().optional(),
        userLimit: userLimitSchema.optional(),
    }),
]);

// Inferred TypeScript type
export type ChannelProps = z.infer<typeof ChannelSchema>;
