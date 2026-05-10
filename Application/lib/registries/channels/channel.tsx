"use client";
import { channelRegistry, ChannelName } from "./channel-registry";

// export type IconName = keyof typeof iconRegistry;

type BaseChannelProps = {
    name: string; // required for ALL channels 
    type: ChannelName; // required for ALL channels 
};

type ChannelProps =
    | (BaseChannelProps & {
        type: "Text";
        private?: boolean;
        topic?: string;
        slowModeDelay?: "Off" | 5 | 10 | 15 | 30;
        ageRestriction?: boolean;
        announcementsFeed?: boolean;
        hideActivity?: "1 Hour" | "24 Hours" | "3 Days" | "1 Week";
    }) | (BaseChannelProps & {
        type: "Voice";
        private?: boolean;
        slowModeDelay?: "Off" | 5 | 10 | 15 | 30;
        ageRestriction?: boolean;
        userLimit?: number; //Needs to be between 1 and 99 for voice channels, 0 for unlimited. 
    }) | (BaseChannelProps & {
        type: "Forum";
        private?: boolean;
        topic?: string;
        tags?: string[];
        tagsRequired?: boolean;
        defaultReactionEmoji?: string;
        slowModePostDelay?: "Off" | 5 | 10 | 15 | 30;
        slowModeMessageDelay?: "Off" | 5 | 10 | 15 | 30;
        defaultLayout?: "Gallery" | "List";
        sortOrder?: "Creation" | "Recent";
        tagMatching?: "Match All" | "Match Some";
        ageRestriction?: boolean;
        hideActivity?: "1 Hour" | "24 Hours" | "3 Days" | "1 Week";
    }) | (BaseChannelProps & {
        type: "Announcement";
        topic?: string;
        ageRestriction?: boolean;
        announcementsFeed?: boolean;
        hideActivity?: "1 Hour" | "24 Hours" | "3 Days" | "1 Week";
    }) | (BaseChannelProps & {
        type: "Stage";
        slowModeDelay?: "Off" | 5 | 10 | 15 | 30;
        ageRestriction?: boolean;
        userLimit?: number; //Needs to be between 1 and 99 for voice channels, 0 for unlimited. 
    });

export function Channel(props: ChannelProps) {
    return <pre>{JSON.stringify(props, null, 2)}</pre>;
}
