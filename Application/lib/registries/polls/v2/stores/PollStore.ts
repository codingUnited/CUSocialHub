import { Poll } from "../Poll";

export interface PollStore {
    loadAll(): Promise<Poll[]>;
    saveAll(polls: Poll[]): Promise<void>;
}