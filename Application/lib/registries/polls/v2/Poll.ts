import { PollOption } from "./PollOptions";

export class Poll {
    private readonly _id: string = crypto.randomUUID();
    private _status: "scheduled" | "open" | "closed" = "scheduled";
    private _title: string;
    private _description: string;
    private _options: PollOption[];
    private _allowUserOptions: boolean;
    private _startDate: Date;
    private _endDate: Date;
    private _timezone: string;
    private _imageUrl?: string;
    private _type: "T/F" | "single" | "multi" | "typed";
    private _textResponses = new Map<string, string>();


    constructor(
        title: string,
        description: string,
        options: PollOption[] = [],
        allowUserOptions: boolean = false,
        startDate: Date,
        endDate: Date,
        status: "scheduled" | "open" | "closed" = "scheduled",
        timezone: string,
        type: "T/F" | "single" | "multi" | "typed",
        imageUrl?: string,
    ) {
        this._status = status;
        this._title = title;
        this._description = description;
        this._options = options;
        this._allowUserOptions = allowUserOptions;
        this._startDate = startDate;
        this._endDate = endDate;
        this._timezone = timezone;
        this._type = type;
        this._imageUrl = imageUrl;
    }
    // Actions
    toJSON() {
        return {
            id: this._id,
            status: this._status,
            title: this._title,
            description: this._description,
            options: this._options.map(o => o.toJSON()),
            allowUserOptions: this._allowUserOptions,
            startDate: this._startDate.toISOString(),
            endDate: this._endDate.toISOString(),
            timezone: this._timezone,
            imageUrl: this._imageUrl,
            type: this._type,
            textResponses: Array.from(this._textResponses.entries())
        };
    }

    static fromData(data: any): Poll {
        const poll = new Poll(
            data.title,
            data.description,
            data.options.map((o: any) => PollOption.fromData(o)),
            data.allowUserOptions,
            new Date(data.startDate),
            new Date(data.endDate),
            data.status,
            data.timezone,
            data.type,
            data.imageUrl
        );

        // Restore ID (override the auto-generated one)
        (poll as any)._id = data.id;

        // Restore text responses
        poll._textResponses = new Map(data.textResponses);

        return poll;
    }


    // ID
    get id(): string {
        return this._id;
    }
    // Type
    get type(): "T/F" | "single" | "multi" | "typed" {
        return this._type;
    }
    // Status
    get status(): "scheduled" | "open" | "closed" {
        const now = new Date();

        if (this._status === "closed") { return "closed"; }

        switch (true) {
            case (now >= this.endDate): return "closed";
            case (now >= this.startDate && now <= this.endDate): return "open";
            default: return "scheduled";
        }
    }
    set status(status: "scheduled" | "open" | "closed") { this._status = status; }

    // Title
    get title(): string { return this._title; }

    set title(value: string) {
        if (!value || value.trim() === "") {
            throw new Error("Poll title cannot be empty.");
        }
        this._title = value;
    }

    //Image Url
    get imageUrl(): string | undefined {
        return this._imageUrl;
    }
    set imageUrl(value: string | undefined) {
        if (value !== undefined && value.trim() === "") {
            throw new Error("Poll image source cannot be empty.");
        }
        this._imageUrl = value;
    }
    // Description
    get description(): string {
        return this._description;
    }
    set description(value: string) {
        if (!value || value.trim() === "") {
            throw new Error("Poll description cannot be empty.");
        }
        this._description = value;
    }

    // Options
    get options(): PollOption[] { return this._options; }
    set options(value: PollOption[]) { this._options = value; }

    // Allow User Options
    get allowUserOptions(): boolean { return this._allowUserOptions; }
    set allowUserOptions(value: boolean) { this._allowUserOptions = value; }

    // Start Date
    get startDate(): Date { return this._startDate; }
    set startDate(value: Date) { this._startDate = value; }


    // End Date
    get endDate(): Date { return this._endDate; }
    set endDate(value: Date) { this._endDate = value; }

    // Timezone
    get timezone(): string { return this._timezone; }
    set timezone(value: string) { this._timezone = value; }

    // Text Responses
    submitTextResponse(userId: string, text: string) {
        if (this._type !== "typed") {
            throw new Error("This poll does not accept typed responses.");
        }
        this._textResponses.set(userId, text);
    }

    getTextResponse(userId: string): string | undefined {
        return this._textResponses.get(userId);
    }

    getAllTextResponses(): string[] {
        return Array.from(this._textResponses.values());
    }
}