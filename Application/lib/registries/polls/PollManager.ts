import { Poll } from "./Poll.ts";
import { type PollData, type PollId, type PollInput, type PollUpdate } from "./PollTypes.ts";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";


export class PollManager {
    private polls: Map<string, Poll>;
    private filePath: string;

    constructor() {
        //Look for data folder holding polls list
        const dataDir = path.join(process.cwd(), "data");

        //If it doesn't exist, create it
        if (!existsSync(dataDir)) {
            mkdirSync(dataDir, { recursive: true });
        };

        //Set file path for polls list
        this.filePath = path.join(dataDir, "polls.json");

        //Create the polls map 
        this.polls = new Map();

        //if the polls map doesn't exist, create an empty one
        if (!existsSync(this.filePath)) {
            writeFileSync(this.filePath, JSON.stringify([], null, 2));
        }

        //Safely load and read polls from polls map
        let raw: any[] = [];
        //Try to read and parse the polls.json file, handling any errors gracefully
        try {
            //Read the file content and parse it as JSON, ensuring it's an array
            const rawContent = readFileSync(this.filePath, "utf8").trim();

            //If the file is empty, initialize raw as an empty array
            raw = rawContent ? JSON.parse(rawContent) : [];

            // If the parsed content is not an array, reset it to an empty array
            if (!Array.isArray(raw)) raw = [];

            // Iterate over the raw data and populate the polls map with Poll instances
            raw.forEach((p: PollData) => {
                this.polls.set(
                    p.id,
                    new Poll(
                        p.id,
                        p.title,
                        p.description,
                        p.options,
                        new Date(p.startDate),
                        new Date(p.endDate),
                        p.status
                    )
                );
            });

        } catch (error) {
            console.error("Error reading or parsing polls.json:", error);
            raw = [];
            writeFileSync(this.filePath, JSON.stringify(raw, null, 2));
        }
    }
    //Loaders
    private save() {
        writeFileSync(
            this.filePath,
            JSON.stringify(Array.from(this.polls.values()), null, 2)
        );
    }
    private reload() {
        const rawContent = readFileSync(this.filePath, "utf8").trim();
        const raw = rawContent ? JSON.parse(rawContent) : [];

        this.polls = new Map(
            raw.map((p: PollData) => [
                p.id,
                new Poll(
                    p.id,
                    p.title,
                    p.description,
                    p.options,
                    new Date(p.startDate),
                    new Date(p.endDate),
                    p.status
                )
            ])
        );
    }



    //Getters
    async getPollById(id: string) {
        this.reload();
        const poll = this.polls.get(id);
        if (!poll) return undefined;

        const now = new Date();
        let changed = false;

        // Auto-open when start time arrives
        if (poll.status === "scheduled" && poll.startDate <= now && poll.endDate >= now) {
            poll.status = "open";
            changed = true;
        }

        // Auto-close when end time passes
        if (poll.status === "open" && poll.endDate < now) {
            poll.status = "closed";
            changed = true;
        }

        // If status changed, save to JSON
        if (changed) this.save();

        return poll;
    }

    async getPollByTitle(title: string) {
        this.reload();
        return this.polls.get(title);
    }

    async getPollByStartAfter(date: Date) {
        this.reload();
        return Array
            .from(this.polls.values())
            .filter(poll => new Date(poll.startDate) >= date);
    }

    async getPollByEndDate(endDate: Date) {
        this.reload();
        const now = new Date();
        return Array
            .from(this.polls.values())
            .filter(poll => new Date(poll.endDate) <= now);
    }

    async getPollsByDaysUntilEnd(days: number) {
        this.reload();
        const now = new Date();
        const targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        return Array
            .from(this.polls.values())
            .filter(poll => poll.endDate <= targetDate);
    }

    async getActivePolls() {
        this.reload();
        const now = new Date();
        return Array.from(this.polls.values()).filter(
            p =>
                p.status === "open" &&
                p.startDate <= now &&
                p.endDate >= now
        );
    }

    async getAllPolls() {
        this.reload();
        const now = new Date();
        for (const poll of this.polls.values()) {
            if (poll.status === "scheduled" && poll.startDate <= now && poll.endDate >= now) {
                poll.status = "open";
            }
            if (poll.status === "open" && poll.endDate < now) {
                poll.status = "closed";
            }
        }
        this.save();
        return Array.from(this.polls.values());
    }

    //Setters
    async createPoll(input: PollInput) {
        this.reload();
        if (this.polls.has(input.id)) {
            throw new Error(`Poll with id "${input.id}" already exists.`);
        }

        const options = input.options;

        const poll = new Poll(
            input.id,
            input.title,
            input.description,
            options,
            input.startDate,
            input.endDate,
            input.status,
            input.allowUserOptions,
            input.timezone
        );

        this.polls.set(poll.id, poll);
        this.save();
        return poll;
    }

    async updatePoll(id: PollId, updates: PollUpdate) {
        this.reload();
        const poll = this.polls.get(id);
        if (!poll) return undefined;

        if (updates.title !== undefined) poll.title = updates.title;
        if (updates.description !== undefined) poll.description = updates.description;
        if (updates.startDate) poll.startDate = new Date(updates.startDate);
        if (updates.endDate) poll.endDate = new Date(updates.endDate);
        if (updates.status) poll.status = updates.status;
        if (updates.options) {
            poll.options = updates.options.map((opt, index) => {
                // Look to see if this option label already existed in the poll
                const existing = poll.options.find(o => o.label === opt.label);
                return {
                    id: `opt-${index + 1}`,
                    label: opt.label,
                    votes: existing ? existing.votes : opt.votes ?? 0 // Preserve historical votes!
                };
            });
        }

        this.save();
        return poll;
    }

    async deletePoll(id: PollId) {
        this.reload();
        const deleted = this.polls.delete(id);
        this.save();
        return deleted;
    }

    async vote(pollId: PollId, optionId: string) {
        this.reload();
        const poll = this.polls.get(pollId);
        if (!poll) throw new Error("Poll not found");

        const now = new Date();
        if (poll.status !== "open" || poll.startDate > now || poll.endDate < now) {
            throw new Error("Poll is not active");
        }

        const option = poll.options.find(o => o.id === optionId);
        if (!option) throw new Error("Option not found");

        option.votes += 1;
        this.save();
        return poll;
    }

    async addUserOption(pollId: string, option: string) {
        const poll = await this.getPollById(pollId);
        if (!poll) throw new Error("Poll not found");

        if (poll.status !== "open") {
            throw new Error("Poll is not active");
        }

        if (!poll.allowUserOptions) {
            throw new Error("User-added options are disabled");
        }

        const normalized = option.trim();
        if (!normalized) throw new Error("Option cannot be empty");

        if (poll.options.some(o => o.label === normalized)) {
            throw new Error("This option already exists");
        }

        poll.options.push({ id: crypto.randomUUID(), label: normalized, votes: 0 });
        await this.updatePoll(pollId, { options: poll.options });

        return poll;
    }

    async addOption(id: string, label: string) {
        const poll = this.polls.get(id);
        if (!poll) throw new Error("Poll not found");

        if (!poll.allowUserOptions) {
            throw new Error("User-added options are disabled for this poll.");
        }

        const normalized = label.trim().toLowerCase();

        // 🚫 Prevent duplicates
        const exists = poll.options.some(
            (opt) => opt.label.trim().toLowerCase() === normalized
        );

        if (exists) {
            throw new Error("This option already exists in the poll.");
        }

        poll.options.push({
            id: `opt-${poll.options.length + 1}`,
            label: label.trim(),
            votes: 0
        });

        this.save();
        return poll;
    }



    async closePoll(pollId: PollId) {
        this.reload();
        const poll = this.polls.get(pollId);
        if (!poll) return undefined;

        poll.status = "closed";
        this.save();
        return poll;
    }
}