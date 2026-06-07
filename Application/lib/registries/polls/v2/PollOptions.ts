import { PollOptionData, PollOptionSchema } from "./schemas/PollOptionSchema";

export class PollOption {
    private readonly _id: string = crypto.randomUUID();;
    private _votes: number = 0;
    private _label: string;
    private votedUsers = new Set<string>();



    constructor(label: string) {
        this._label = label;
    }

    static fromData(data: unknown): PollOption {
        const validatedData: PollOptionData = PollOptionSchema.parse(data);
        const option = new PollOption(validatedData.label);
        (option as any)._id = validatedData.id; // Override generated ID with validated ID
        option._votes = validatedData.votes;
        option.votedUsers = new Set(validatedData.votedUsers ?? []);
        return option;
    }

    // ID
    get id(): string {
        return this._id;
    }
    //Label
    get label(): string { return this._label; }

    // Votes
    get votes(): number { return this._votes; }

    upVote() {
        this._votes += 1;
    }
    downVote() {
        if (this._votes > 0) {
            this._votes -= 1;
        }
    }

    // Admin Actions 
    set label(value: string) { this._label = value; }
    set votes(value: number) {
        if (value < 0) throw new Error("Votes cannot be negative.");
        this._votes = value;
    }
    resetVotes() {
        this._votes = 0;
    }
    toJSON() {
        return {
            id: this.id,
            label: this.label,
            votes: this.votes,
            votedUsers: Array.from(this.votedUsers)
        };
    }
    clone(): PollOption {
        const option = new PollOption(this.label);
        (option as any)._id = this.id; // Preserve ID in clone)
        option._votes = this.votes;
        option.votedUsers = new Set(this.votedUsers);
        return option;
    }
    ////
    // Tracking& Analytics
    castVote(userId: string) {
        if (this.votedUsers.has(userId)) return false;
        this.votedUsers.add(userId);
        this._votes += 1;
        return true;
    }
    removeUserVote(userId: string) {
        if (!this.votedUsers.has(userId)) return false;
        this.votedUsers.delete(userId);
        this._votes -= 1;
        return true;
    }
    hasUserVoted(userId: string): boolean {
        return this.votedUsers.has(userId);
    }
}
