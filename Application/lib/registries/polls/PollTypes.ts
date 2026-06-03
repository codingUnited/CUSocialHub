// A unique ID for a poll
export type PollId = string;

// Poll status
export type PollStatus = "scheduled" | "open" | "closed";

// A single poll option
export interface PollOption {
    id: string;
    label: string;
    votes: number;
}

// Raw poll data stored in polls.json
export interface PollData {
    id: PollId;
    title: string;
    description: string;
    options: PollOption[];
    startDate: string; // ISO string in JSON
    endDate: string;   // ISO string in JSON
    status: PollStatus;
}

// Input when creating a poll
export interface PollInput {
    id: PollId;
    title: string;
    description: string;
    options: string[]; // labels only — PollManager converts to PollOption[]
    startDate: Date;
    endDate: Date;
    status?: PollStatus; // Optional, defaults to "scheduled"
}

// Partial update
export interface PollUpdate {
    title?: string;
    description?: string;
    options?: string[];
    startDate?: Date;
    endDate?: Date;
    status?: PollStatus;
}

// For AM/PM date builder
export interface DateTimeParts {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute?: number;
    second?: number;
    period?: "AM" | "PM";
}
