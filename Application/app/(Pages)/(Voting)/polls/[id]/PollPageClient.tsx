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
    Stack,
    Text,
    Input,
    CheckboxCard,
    CheckboxGroup
} from "@chakra-ui/react";
import { PollOption } from "@/lib/registries/polls/PollTypes";

interface PollPageClientProps {
    id: string;
}

export default function PollPageClient({ id }: { id: string }) {
    const [poll, setPoll] = useState<any>(null);
    const [error, setError] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newLink, setNewLink] = useState("");
    const [localVoted, setLocalVoted] = useState<Record<string, boolean>>({});
    const [selected, setSelected] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Primary polling data fetcher
    async function loadPoll() {
        try {
            const res = await fetch(`/api/polls/${id}`, { cache: "no-store" });
            const data = await res.json();
            setPoll(data);
        } catch (err) {
            console.error("Failed to fetch poll:", err);
        }
    }

    async function handleAddOption() {
        setError("");
        if (!newTitle.trim()) {
            setError("Title is required");
            return;
        }

        const platform = detectPlatform(newLink);
        const finalTitle = `${newTitle} | ${platform}`;

        try {
            const res = await fetch(`/api/polls/${id}/add-option`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: finalTitle,
                    link: newLink
                })
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.error || "Failed to add option");
                return;
            }

            setNewTitle("");
            setNewLink("");
            loadPoll();
        } catch (err) {
            setError("Network error adding option.");
        }
    }

    useEffect(() => {
        loadPoll(); // Initial layout load
        const interval = setInterval(() => {
            loadPoll();
        }, 2000); // Check for updates every 2 seconds

        return () => clearInterval(interval);
    }, [id]);

    if (!poll) {
        return (
            <Container maxW="md" py="12">
                <Text color="fg.muted">Loading poll...</Text>
            </Container>
        );
    }

    const now = new Date();
    const start = new Date(poll.startDate);
    const end = new Date(poll.endDate);
    const isActive = now >= start && now <= end && poll.status === "open";

    const totalVotes = Array.isArray(poll.options)
        ? poll.options.reduce((sum: number, o: PollOption) => sum + o.votes, 0)
        : 0;

    function hasVoted(pollId: string, optionId: string) {
        if (typeof window === "undefined") return false;
        const cookieKey = `poll_${pollId}_option_${optionId}=true`;
        return document.cookie.includes(cookieKey);
    }

    function toggleOption(optionId: string) {
        setSelected((prev) =>
            prev.includes(optionId)
                ? prev.filter((item) => item !== optionId)
                : [...prev, optionId]
        );
    }

    // Determine which selections are valid to accept votes
    const selectableOptions = selected.filter(
        (optionId) => !hasVoted(poll.id, optionId) && !localVoted[optionId]
    );

    // FIXED: Executes all network vote distributions at the exact same time cleanly
    async function castVotes() {
        if (selectableOptions.length === 0) return;
        setIsSubmitting(true);

        // Instantly switch UI buttons into a local processing lock-state 
        const updatedVotes = { ...localVoted };
        selectableOptions.forEach(id => { updatedVotes[id] = true; });
        setLocalVoted(updatedVotes);

        try {
            const votePromises = selectableOptions.map((optionId) =>
                fetch(`/api/polls/${poll.id}/vote`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ optionId }),
                })
            );

            // Wait until every single vote request is fulfilled concurrently
            await Promise.all(votePromises);
            setSelected([]);
            await loadPoll();
        } catch (err) {
            alert("An error occurred while saving your votes. Please check connection.");
            // Revert local UI locks if failure occurs
            const rolledBackVotes = { ...localVoted };
            selectableOptions.forEach(id => { rolledBackVotes[id] = false; });
            setLocalVoted(rolledBackVotes);
        } finally {
            setIsSubmitting(false);
        }
    }

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
            <Presence
                present={true}
                animationName={{ _open: "fade-in", _closed: "fade-out" }}
                animationDuration="moderate"
            >
                <Card.Root p="6" shadow="lg" borderRadius="xl">
                    <Card.Body>
                        <Stack gap="5">
                            <Box>
                                <Heading size="lg">{poll.title}</Heading>
                                <Text mt="2" color="fg.muted">{poll.description}</Text>

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

                            {/* INTEGRATED THE CORRECTED CHECKBOX CARD ARCHITECTURE */}
                            <CheckboxGroup disabled={!isActive || isSubmitting}>
                                <Stack gap="2" width="100%">
                                    {Array.isArray(poll.options) && poll.options.map((o: PollOption) => {
                                        const voted = hasVoted(poll.id, o.id) || localVoted[o.id];
                                        const isSelected = selected.includes(o.id);

                                        return (
                                            <CheckboxCard.Root
                                                key={o.id}
                                                value={o.id}
                                                disabled={voted || !isActive || isSubmitting}
                                                checked={isSelected || voted}
                                                onCheckedChange={() => toggleOption(o.id)}
                                                colorPalette={voted ? "green" : "blue"}
                                                size="sm"
                                                width="100%"
                                                variant="subtle"
                                                borderRadius="md"
                                                opacity={voted ? 0.8 : 1}
                                                bg={voted ? "green.subtle" : isSelected ? "blue.subtle" : "transparent"}
                                                borderColor={voted ? "green.solid" : isSelected ? "blue.solid" : "border.subtle"}
                                                _hover={!voted && isActive ? { bg: "bg.muted/50" } : {}}
                                                transition="all 0.15s ease"
                                            >
                                                <CheckboxCard.HiddenInput />

                                                <CheckboxCard.Control
                                                    p="2"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    width="100%"
                                                    gap="3"
                                                >
                                                    <CheckboxCard.Content flex="1">
                                                        <CheckboxCard.Label
                                                            fontSize="sm"
                                                            fontWeight={isSelected ? "semibold" : "normal"}
                                                            color={voted ? "green.fg" : isSelected ? "blue.fg" : "fg"}
                                                        >
                                                            {o.label}
                                                        </CheckboxCard.Label>
                                                    </CheckboxCard.Content>

                                                    <Box display="flex" alignItems="center" gap="2.5">
                                                        {voted && (
                                                            <Badge colorPalette="green" variant="subtle" size="sm" px="1.5">
                                                                Voted
                                                            </Badge>
                                                        )}
                                                        <CheckboxCard.Indicator />
                                                    </Box>
                                                </CheckboxCard.Control>
                                            </CheckboxCard.Root>
                                        );
                                    })}
                                </Stack>
                            </CheckboxGroup>

                            {/* OPTION SUGGESTIONS SECTION */}
                            {isActive && poll.allowUserOptions && (
                                <Stack gap="3" mt="2" p="3" border="1px solid" borderColor="border.muted" borderRadius="md">
                                    <Text fontSize="sm" fontWeight="medium">Suggest a Movie Option:</Text>
                                    <Input
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="Movie title..."
                                        size="sm"
                                    />

                                    <Input
                                        value={newLink}
                                        onChange={(e) => setNewLink(e.target.value)}
                                        placeholder="Streaming link..."
                                        size="sm"
                                    />

                                    {error && (
                                        <Text color="red.500" fontSize="xs">
                                            {error}
                                        </Text>
                                    )}

                                    <Button colorPalette="blue" size="sm" onClick={handleAddOption}>
                                        Add Suggestion
                                    </Button>
                                </Stack>
                            )}

                            {/* SUBMIT BUTTON */}
                            <Button
                                colorPalette="purple"
                                size="lg"
                                onClick={castVotes}
                                loading={isSubmitting}
                                disabled={selectableOptions.length === 0 || !isActive}
                                mt="4"
                            >
                                Cast Selected Vote(s) ({selectableOptions.length})
                            </Button>
                        </Stack>

                        <Text textAlign="center" color="fg.muted" fontSize="sm" mt="4">
                            Total votes: {totalVotes}
                        </Text>
                    </Card.Body>
                </Card.Root>
            </Presence>
        </Container>
    );
}