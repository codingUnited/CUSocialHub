"use client";

import { useState } from "react";
import {
    Button,
    Field,
    Heading,
    Input,
    NumberInput,
    Stack
} from "@chakra-ui/react";

export default function CreatePollPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState("");
    const [durationMinutes, setDurationMinutes] = useState("60");
    const [allowUserOptions, setAllowUserOptions] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;





    async function createPoll() {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            alert("Please select valid start and end dates.");
            return;
        }

        if (end <= start) {
            alert("End date must be after start date.");
            return;
        }


        await fetch("/api/polls", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: crypto.randomUUID(),
                title,
                description,
                options: options.split(",").map((label, index) => ({
                    id: `opt-${index + 1}`,
                    label: label.trim(),
                    votes: 0
                })),
                startDate: start,
                endDate: end,
                allowUserOptions,
                timezone
            })
        });

        window.location.href = "/polls";
    }

    return (
        <Stack gap="5" align="stretch" maxW="md" mx="auto" py="12">
            <Heading size="2xl">Create Poll</Heading>

            {/* Native Field Structure */}
            <Field.Root>
                <Field.Label>Title</Field.Label>
                <Input
                    placeholder="Enter poll title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </Field.Root>

            <Field.Root>
                <Field.Label>Description</Field.Label>
                <Input
                    placeholder="Enter description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </Field.Root>

            <Field.Root>
                <Field.Label>Options</Field.Label>
                <Input
                    placeholder="e.g. Apples, Oranges, Bananas"
                    value={options}
                    onChange={e => setOptions(e.target.value)}
                />
                <Field.HelperText>Separate options with a comma.</Field.HelperText>
            </Field.Root>
            <Field.Root>
                <Field.Label>Allow Users to Add Options?</Field.Label>
                <input
                    type="checkbox"
                    checked={allowUserOptions}
                    onChange={(e) => setAllowUserOptions(e.target.checked)}
                />
                <Field.HelperText>
                    If enabled, users can add their own options while the poll is active.
                </Field.HelperText>
            </Field.Root>


            {/* Native NumberInput Structure */}
            <Field.Root>
                <Field.Label>Start Date & Time</Field.Label>
                <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </Field.Root>

            <Field.Root>
                <Field.Label>End Date & Time</Field.Label>
                <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </Field.Root>


            <Button colorPalette="green" onClick={createPoll}>
                Create Poll
            </Button>
        </Stack>
    );
}
