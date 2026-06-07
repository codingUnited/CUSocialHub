import fs from "fs";
import path from "path";
import { PollStore } from "./PollStore";
import { Poll } from "../Poll";

export class LocalPollStore implements PollStore {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = path.resolve(filePath);

        // Ensure directory exists
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Ensure file exists
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, "[]", "utf8");
        }
    }

    async loadAll(): Promise<Poll[]> {
        const raw = fs.readFileSync(this.filePath, "utf8");
        const data = JSON.parse(raw);
        return data.map((pollData: any) => Poll.fromData(pollData));
    }

    async saveAll(polls: Poll[]): Promise<void> {
        const raw = polls.map(p => p.toJSON());
        fs.writeFileSync(this.filePath, JSON.stringify(raw, null, 2), "utf8");
    }
}
