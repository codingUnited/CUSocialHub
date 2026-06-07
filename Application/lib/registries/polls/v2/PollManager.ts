import { Poll } from "./Poll";
import { PollOption } from "./PollOptions";
import { PollStore } from "../persistence/PollStore";

export class PollManager {
    private polls = new Map<string, Poll>();
    private store: PollStore;

    constructor(store: PollStore) {
        this.store = store;
    }

    // Load all polls from storage
    async load(): Promise<void> {
        const loaded = await this.store.loadAll();
        loaded.forEach(poll => this.polls.set(poll.id, poll));
    }

    // Save all polls to storage
    private async save(): Promise<void> {
        await this.store.saveAll([...this.polls.values()]);
    }

    // Create a new poll
    async createPoll(poll: Poll): Promise<Poll> {
        if (this.polls.has(poll.id)) {
            throw new Error(`Poll with ID ${poll.id} already exists.`);
        }
        this.polls.set(poll.id, poll);
        await this.save();
        return poll;
    }

    // Get a poll by ID
    getPoll(id: string): Poll | undefined {
        return this.polls.get(id);
    }

    // Delete a poll
    async deletePoll(id: string): Promise<boolean> {
        const existed = this.polls.delete(id);
        if (existed) await this.save();
        return existed;
    }

    // Update an existing poll
    async updatePoll(poll: Poll): Promise<void> {
        if (!this.polls.has(poll.id)) {
            throw new Error(`Poll with ID ${poll.id} does not exist.`);
        }
        this.polls.set(poll.id, poll);
        await this.save();
    }

    // Clear ALL polls
    async clearAll(): Promise<void> {
        this.polls.clear();
        await this.save();
    }

    // Get all polls
    getAllPolls(): Poll[] {
        return [...this.polls.values()];
    }

    // Get polls by status
    get activePolls(): Poll[] {
        return [...this.polls.values()].filter(p => p.status === "open");
    }

    get scheduledPolls(): Poll[] {
        return [...this.polls.values()].filter(p => p.status === "scheduled");
    }

    get closedPolls(): Poll[] {
        return [...this.polls.values()].filter(p => p.status === "closed");
    }

    // Voting logic
    async vote(pollId: string, userId: string, optionId: string): Promise<void> {
        const poll = this.polls.get(pollId);
        if (!poll) throw new Error("Poll not found.");
        if (poll.status !== "open") throw new Error("Poll is not open.");

        switch (poll.type) {
            case "T/F":
            case "single":
                this.handleSingleVote(poll, userId, optionId);
                break;

            case "multi":
                this.handleMultiVote(poll, userId, optionId);
                break;

            case "typed":
                throw new Error("Use submitTypedResponse() for typed polls.");
        }

        await this.save();
    }

    private handleSingleVote(poll: Poll, userId: string, optionId: string) {
        // Remove previous votes
        for (const option of poll.options) {
            if (option.hasUserVoted(userId)) {
                option.removeUserVote(userId);
            }
        }

        // Add new vote
        const option = poll.options.find(o => o.id === optionId);
        if (!option) throw new Error("Option not found.");

        option.castVote(userId);
    }

    private handleMultiVote(poll: Poll, userId: string, optionId: string) {
        const option = poll.options.find(o => o.id === optionId);
        if (!option) throw new Error("Option not found.");

        // Toggle vote
        if (option.hasUserVoted(userId)) {
            option.removeUserVote(userId);
        } else {
            option.castVote(userId);
        }
    }

    // Typed poll response
    async submitTypedResponse(pollId: string, userId: string, text: string): Promise<void> {
        const poll = this.polls.get(pollId);
        if (!poll) throw new Error("Poll not found.");
        if (poll.type !== "typed") throw new Error("Not a typed poll.");
        if (poll.status !== "open") throw new Error("Poll is not open.");

        poll.submitTextResponse(userId, text);
        await this.save();
    }
}
