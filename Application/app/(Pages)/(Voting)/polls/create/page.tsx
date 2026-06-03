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

    async function createPoll() {
        const start = new Date();
        const durationNum = parseInt(durationMinutes, 10) || 60;
        const end = new Date(start.getTime() + durationNum * 60 * 1000);

        await fetch("/api/polls", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: crypto.randomUUID(),
                title,
                description,
                options: options.split(",").map(o => o.trim()),
                startDate: start,
                endDate: end
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

            {/* Native NumberInput Structure */}
            <Field.Root>
                <Field.Label>Duration (Minutes)</Field.Label>
                <NumberInput.Root
                    value={durationMinutes}
                    onValueChange={(e) => setDurationMinutes(e.value)}
                    min={1}
                    width="full"
                >
                    <NumberInput.Control>
                        <NumberInput.IncrementTrigger />
                        <NumberInput.DecrementTrigger />
                    </NumberInput.Control>
                    <NumberInput.Input placeholder="Duration in minutes" />
                </NumberInput.Root>
            </Field.Root>

            <Button colorPalette="green" onClick={createPoll}>
                Create Poll
            </Button>
        </Stack>
    );
}
