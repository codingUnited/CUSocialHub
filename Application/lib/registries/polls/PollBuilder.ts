console.log("Loaded PollTypes.ts");
import type { PollInput } from "./PollTypes.ts";


export class PollBuilder {
    private id!: string;
    private title!: string;
    private description = "";
    private options: string[] = [];
    private startDate: Date = new Date();
    private endDate: Date = new Date();
    private status?: "scheduled" | "open" | "closed";
    private allowUserOptions = false;
    private timezone = "UTC";

    withId(id: string) {
        this.id = id;
        return this;
    }

    withTitle(title: string) {
        this.title = title;
        return this;
    }

    withDescription(description: string) {
        this.description = description;
        return this;
    }

    withOptions(options: string[]) {
        this.options = options;
        return this;
    }

    startingAt(date: Date) {
        this.startDate = date;
        return this;
    }

    endingAt(date: Date) {
        this.endDate = date;
        return this;
    }

    withAllowUserOptions(allow: boolean) {
        this.allowUserOptions = allow;
        return this;
    }

    withTimezone(timezone: string) {
        this.timezone = timezone;
        return this;
    }


    build(): PollInput {
        if (!this.id || !this.title) {
            throw new Error("PollBuilder: id and title are required");
        }

        const now = new Date();

        const formattedOptions = this.options.map((label, index) => ({
            id: `opt_${index}_${Date.now()}`,
            label: label,
            votes: 0
        }));

        return {
            id: this.id,
            title: this.title,
            description: this.description,
            options: formattedOptions,
            startDate: this.startDate,
            endDate: this.endDate,
            status: this.startDate <= now ? "open" : "scheduled",
            allowUserOptions: this.allowUserOptions,
            timezone: this.timezone
        };
    }
}
