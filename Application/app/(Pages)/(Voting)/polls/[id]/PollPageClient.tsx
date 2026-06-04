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
    const [newOption, setNewOption] = useState("");
    const [error, setError] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newLink, setNewLink] = useState("");
    const [links, setLinks] = useState<Record<string, string>>({});


    // Store readable titles locally (keyed by option.label)
    const [titles, setTitles] = useState<Record<string, string>>({});

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
    async function handleAddOption() {
        setError("");

        const platform = detectPlatform(newLink);
        const finalTitle = `${newTitle} | ${platform}`;

        const res = await fetch(`/api/polls/${id}/add-option`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: finalTitle,
                link: newLink
            })
        });

        const data = await res.json();
        if (data.link) {
            setLinks(prev => ({
                ...prev,
                [finalTitle]: data.link
            }));
        }


        if (!data.success) {
            setError(data.error);
            return;
        }

        setNewTitle("");
        setNewLink("");
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
    const totalVotes = Array.isArray(poll.options)
        ? poll.options.reduce((sum, o) => sum + o.votes, 0)
        : 0;

    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: poll.timezone,
        dateStyle: "medium",
        timeStyle: "short"
    });

    function detectPlatform(url: string): string {
        const u = url.toLowerCase();

        if (u.includes("netflix.com")) return "Netflix";
        if (u.includes("hulu.com")) return "Hulu";
        if (u.includes("hbomax.com") || u.includes("max.com")) return "HBO Max";
        if (u.includes("disney.com")) return "Disney+";
        if (u.includes("amazon.com")) return "Prime Video";
        if (u.includes("paramountplus.com")) return "Paramount+";
        if (u.includes("peacocktv.com")) return "Peacock";

        return "Streaming";
    }

    return (
        <Container maxW="md" py="12">
            {/* Replaced Fade with the v3 Presence component [1] */}
            <Presence
                present={true}
                animationName={{ _open: "fade-in", _closed: "fade-out" }}
                animationDuration="moderate"
            >
                <Card.Root p="6" shadow="lg" borderRadius="xl">
                    {/* Replaced spacing with gap [2] */}
                    <Stack gap="5">
                        <Box>
                            <Heading size="lg">{poll.title}</Heading>
                            <Text mt="2" color="fg.muted">{poll.description}</Text>

                            {/* Replaced colorScheme with colorPalette [2] */}
                            <Badge
                                mt="3"
                                px="3"
                                py="1"
                                borderRadius="md"
                                colorPalette={isActive ? "green" : "red"}
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

                                // Use readable title if we have it
                                const displayTitle =
                                    titles[opt.label] ??
                                    opt.label;
                                return (
                                    <Box key={opt.id}>
                                        <Button
                                            w="full"
                                            justifyContent="space-between"
                                            variant={isActive ? "solid" : "outline"}
                                            colorPalette="blue"
                                            onClick={() => isActive && vote(opt.id)}
                                            disabled={!isActive} // Replaced isDisabled [3]
                                        >
                                            <span>{displayTitle}</span>
                                            <span>{opt.votes} votes</span>
                                        </Button>
                                        <a href={links[opt.label]} target="_blank" rel="noopener noreferrer">
                                            View Movie
                                        </a>



                                        {/* Progress broken into v3 compound components [4] */}
                                        <Progress.Root
                                            mt="2"
                                            value={percent}
                                            size="sm"
                                            borderRadius="md"
                                            colorPalette="blue"
                                        >
                                            <Progress.Track>
                                                <Progress.Range />
                                            </Progress.Track>
                                        </Progress.Root>

                                    </Box>

                                );
                            })}
                            {isActive && poll.allowUserOptions && (
                                <>
                                    <input
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="Movie title..."
                                        className="border p-2 rounded w-full"
                                    />

                                    <input
                                        value={newLink}
                                        onChange={(e) => setNewLink(e.target.value)}
                                        placeholder="Streaming link..."
                                        className="border p-2 rounded w-full mt-2"
                                    />


                                    {error && (
                                        <Text color="red.500" fontSize="sm" mt="2">
                                            {error}
                                        </Text>
                                    )}

                                    <Button colorScheme="blue" onClick={handleAddOption}>
                                        Add
                                    </Button>
                                </>
                            )}

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
