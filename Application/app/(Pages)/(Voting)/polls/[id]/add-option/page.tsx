"use client";

import { useState } from "react";
import {
    Box,
    Button,
    Card,
    Container,
    Heading,
    Input,
    Stack,
    Text
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function AddOptionPage({ params }: { params: { id: string } }) {
    const pollId = params.id;
    const router = useRouter();

    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    async function submit() {
        setError("");

        const res = await fetch(`/api/polls/${pollId}/add-option`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ option: value })
        });

        const data = await res.json();

        if (!data.success) {
            setError(data.error);
            return;
        }

        router.push(`/polls/${pollId}`);
    }

    return (
        <Container maxW="md" py="12">
            <Card p="6" shadow="lg" borderRadius="xl">
                <Stack gap="5">
                    <Heading size="lg">Add an Option</Heading>

                    <Text color="fg.muted">
                        Add a new option to this poll. Make sure it’s clear and unique.
                    </Text>

                    <Input
                        placeholder="Enter your option..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />

                    {error && (
                        <Text color="red.400" fontSize="sm">
                            {error}
                        </Text>
                    )}

                    <Button colorScheme="blue" onClick={submit}>
                        Add Option
                    </Button>

                    <Button variant="ghost" onClick={() => router.push(`/polls/${pollId}`)}>
                        Back to Poll
                    </Button>
                </Stack>
            </Card>
        </Container>
    );
}
