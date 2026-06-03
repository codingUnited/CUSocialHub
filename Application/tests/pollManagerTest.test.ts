import { PollManager } from "../lib/registries/polls/PollManager.ts";
import { PollBuilder } from "../lib/registries/polls/PollBuilder.ts";
import { atDateTime, fromNow } from "../lib/utilities/timeKeeper.ts";
import { writeFileSync } from "fs";
import { join } from "path";

const dataFile = join(process.cwd(), "data", "polls.json");
writeFileSync(dataFile, "[]");

async function run() {
    console.log("=== PollManager Test Start ===");

    const manager = new PollManager();

    // 1. Create poll
    const pollInput = new PollBuilder()
        .withId("test-002")
        .withTitle("Friday Night Byte — Test Poll")
        .withDescription("Testing PollManager end-to-end.")
        .withOptions(["Option A", "Option B", "Option C"])
        .startingAt(fromNow({ seconds: -10 }))
        .endingAt(fromNow({ hours: 12 }))
        .build();

    console.log("\nCreating poll...");
    const created = await manager.createPoll(pollInput);
    console.log("Created poll:", created);

    // 2. Fetch all polls
    console.log("\nAll polls:", await manager.getAllPolls());

    // 3. Fetch by ID
    console.log("\nFetching poll by ID...");
    const fetched = await manager.getPollById("test-002");
    console.log("Fetched poll:", fetched);

    // 4. Update poll
    console.log("\nUpdating poll...");
    const updated = await manager.updatePoll("test-002", {
        description: "Updated description",
        options: ["Option A", "Option B", "Option C", "Option D"]
    });
    console.log("Updated poll:", updated);

    // 5. Vote
    console.log("\nVoting on poll...");
    const voted = await manager.vote("test-002", "opt-1");
    console.log("Poll after vote:", voted);

    // Verify disk persistence:
    const { readFileSync } = await import("fs");
    console.log("\nRaw JSON contents on Disk:", readFileSync(dataFile, "utf8"));

    // 6. Get active polls
    console.log("\nActive polls:", await manager.getActivePolls());

    // 7. Close poll
    console.log("\nClosing poll...");
    const closed = await manager.closePoll("test-002");
    console.log("Closed poll:", closed);

    // // 8. Delete poll
    // console.log("\nDeleting poll...");
    // const deleted = await manager.deletePoll("test-002");
    // console.log("Deleted:", deleted);

    // console.log("\n=== PollManager Test Complete ===");

    const savedPoll = await manager.getPollById("test-002");

    if (savedPoll) {
        console.log("\n=== Timezone Verification ===");
        console.log("Raw ISO String (Database UTC):", savedPoll.startDate.toISOString());

        // This converts the UTC file date back to your exact Windows machine timezone (EST)
        console.log("Local Machine Display (EST):  ", savedPoll.startDate.toLocaleString("en-US", { timeZoneName: "short" }));
    }
}


run();
