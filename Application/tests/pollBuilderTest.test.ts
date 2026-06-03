import { writeFileSync } from "fs";
import { join } from "path";

// Reset the correct polls.json file
// Your working directory when running tests is: /Application
// So the correct path is: /Application/data/polls.json
const dataFile = join(process.cwd(), "data", "polls.json");
writeFileSync(dataFile, "[]");

import { PollManager } from "../lib/registries/polls/PollManager.ts";
import { PollBuilder } from "../lib/registries/polls/PollBuilder.ts";
import { atDateTime, fromNow } from "../lib/utilities/timeKeeper.ts";

async function run() {
    console.log("=== PollBuilder Test Start ===");

    const manager = new PollManager();

    // Build a poll using your builder + AM/PM date helper
    const input = new PollBuilder()
        .withId("fnb-2026-06-07")
        .withTitle("Friday Night Byte — Weekly Vote")
        .withDescription("Choose this week's feature!")
        .withOptions(["Movie A", "Movie B", "Movie C"])
        .startingAt(fromNow({ seconds: -10 })
        )
        .endingAt(fromNow({ days: 1 })
        )
        .build();

    console.log("\nCreating poll...");
    const created = await manager.createPoll(input);
    console.log("Created poll:", created);

    console.log("\nAll polls:", await manager.getAllPolls());

    console.log("\nFetching poll by ID...");
    const fetched = await manager.getPollById("fnb-2026-06-07");
    console.log("Fetched poll:", fetched);

    console.log("\nUpdating poll...");
    const updated = await manager.updatePoll("fnb-2026-06-07", {
        description: "Updated description",
        options: ["Option A", "Option B", "Option C", "Option D"]
    });
    console.log("Updated poll:", updated);

    console.log("\nVoting on poll...");
    const voted = await manager.vote("fnb-2026-06-07", "opt-1");
    console.log("Poll after vote:", voted);

    console.log("\nActive polls:", await manager.getActivePolls());

    console.log("\n=== PollBuilder Test Complete ===");

    const savedPoll = await manager.getPollById("test-002");

    if (savedPoll) {
        console.log("\n=== Timezone Verification ===");
        console.log("Raw ISO String (Database UTC):", savedPoll.startDate.toISOString());

        // This converts the UTC file date back to your exact Windows machine timezone (EST)
        console.log("Local Machine Display (EST):  ", savedPoll.startDate.toLocaleString("en-US", { timeZoneName: "short" }));
    }
}

run();
