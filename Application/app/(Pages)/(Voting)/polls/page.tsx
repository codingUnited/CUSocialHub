"use client";

import { useEffect, useState } from "react";
import { Box, Heading, VStack, Link } from "@chakra-ui/react";
import NextLink from "next/link";

export default function PollListPage() {
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        fetch("/api/polls")
            .then(res => res.json())
            .then(setPolls);
    }, []);

    return (
        <VStack gap={4} align="stretch">
            <Heading>Polls</Heading>

            {polls.map((poll: any) => (
                <Box key={poll.id} p={4} borderWidth="1px" rounded="md">
                    <Link as={NextLink} href={`/polls/${poll.id}`}>
                        {poll.title}
                    </Link>
                </Box>
            ))}
        </VStack>
    );
}
