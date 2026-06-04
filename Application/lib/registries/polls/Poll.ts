import type { PollOption, PollStatus } from "./PollTypes.ts";

export class Poll {
    id: string;
    title: string;
    description: string;
    options: PollOption[];
    startDate: Date;
    endDate: Date;
    status: PollStatus;
    allowUserOptions: boolean;
    timezone: string;


    constructor(
        id: string,
        title: string,
        description: string,
        options: PollOption[],
        startDate: Date,
        endDate: Date,
        status: PollStatus = "scheduled",
        allowUserOptions: boolean = true,
        timezone: string = "UTC"


    ) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.options = options;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.allowUserOptions = allowUserOptions;
        this.timezone = timezone;

    }
}