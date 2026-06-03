"use client";

import { useEffect, useState } from "react";
import {
    Badge,
    Box,
    Button,
    Card,
    Container,
    Heading,
    Presence,
    Progress,
    Stack,
    Text
} from "@chakra-ui/react";

export default function PollPageClient({ id }: { id: string }) {
    const [poll, setPoll] = useState<any>(null);

    async function loadPoll() {
        const res = await fetch(`/api/polls/${id}`, { cache: "no-store" });
        const data = await res.json();
        setPoll(data);
    }

    async function vote(optionId: string) {
        await fetch(`/api/polls/${id}/vote`, {
            method: "POST",
            cache: "no-store",
            body: JSON.stringify({ optionId }),
            headers: { "Content-Type": "application/json" }
        });
        loadPoll();
    }

    useEffect(() => {
        loadPoll(); // initial load

        const interval = setInterval(() => {
            loadPoll();
        }, 2000); // every 2 seconds

        return () => clearInterval(interval);
    }, [id]);

    if (!poll) {
        return (
            <Container maxW="md" py="12">
                <Text color="fg.muted">Loading poll...</Text>
            </Container>
        );
    }

    // LOCAL TIME CHECK
    const now = new Date();
    const start = new Date(poll.startDate);
    const end = new Date(poll.endDate);

    const isActive = now >= start && now <= end && poll.status === "open";


    const totalVotes = poll.options.reduce((sum: number, o: any) => sum + o.votes, 0);

    return (
        <Container maxW="md" py="12">
            <Presence
                present={true}
                animationName={{ _open: "fade-in", _closed: "fade-out" }}
                animationDuration="moderate"
            >
                <Card.Root p="6" shadow="lg" borderRadius="xl">
                    <Stack gap="5">
                        <Box>
                            <Heading size="lg">{poll.title}</Heading>
                            <Text mt="2" color="fg.muted">{poll.description}</Text>

                            <Badge
                                mt="3"
                                px="3"
                                py="1"
                                borderRadius="md"
                                colorScheme={isActive ? "green" : "red"}
                                fontSize="sm"
                            >
                                {isActive ? "Active Now" : "Not Active"}
                            </Badge>
                        </Box>

                        <Stack gap="4">
                            {poll.options.map((opt: any) => {
                                const percent = totalVotes === 0
                                    ? 0
                                    : Math.round((opt.votes / totalVotes) * 100);

                                return (
                                    <Box key={opt.id}>
                                        <Button
                                            w="full"
                                            justifyContent="space-between"
                                            variant={isActive ? "solid" : "outline"}
                                            colorScheme="blue"
                                            onClick={() => isActive && vote(opt.id)}
                                            disabled={!isActive}
                                        >
                                            <span>{opt.label}</span>
                                            <span>{opt.votes} votes</span>
                                        </Button>

                                        <Progress.Root
                                            mt="2"
                                            value={percent}
                                            size="sm"
                                            borderRadius="md"
                                            colorScheme="blue"
                                        />
                                    </Box>
                                );
                            })}
                        </Stack>

                        <Text textAlign="center" color="fg.muted" fontSize="sm">
                            Total votes: {totalVotes}
                        </Text>
                    </Stack>
                </Card.Root>
            </Presence>
        </Container>
    );
}
