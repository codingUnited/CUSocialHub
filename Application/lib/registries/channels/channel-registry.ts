// icon-registry.ts
import * as Channels from "./index";


export const channelRegistry = {
  "Text": Channels.default.text,
  "Voice": Channels.default.voice,
  "Forum": Channels.default.forum,
  "Announcement": Channels.default.announcement,
  "Stage": Channels.default.stage,
};
export type ChannelName = keyof typeof channelRegistry;
