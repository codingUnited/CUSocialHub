import z from "zod";
import { Poll } from "./Poll";
import { PollOption } from "./PollOptions";
import { PollBuilderSchema } from "./schemas/PollBuilderSchema";

export class PollBuilder {
    private data: z.infer<typeof PollBuilderSchema>;

    constructor(rawInput: unknown) {
        this.data = PollBuilderSchema.parse(rawInput);
    }

    build(): Poll {
        let options: PollOption[] = [];
        let allowUserOptions = this.data.allowUserOptions;
        switch (this.data.type) {
            case "T/F":
                options = [
                    new PollOption("True"),
                    new PollOption("False")
                ];
                allowUserOptions = false;
                break;

            case "single":
            case "multi":
                options = this.data.options.map(opt => PollOption.fromData(opt));
                break;

            case "typed":
                options = [];
                allowUserOptions = false;
                break;

            default:
                throw new Error(`Unknown poll type: ${this.data.type}`);
        }
        return new Poll(
            this.data.title,
            this.data.description,
            options,
            allowUserOptions,
            this.data.startDate,
            this.data.endDate,
            this.data.status,
            this.data.timezone,
            this.data.type,
            this.data.imageUrl
        );
    }

}
