"use client";

import { useState } from "react";
import { ChannelSchema, ChannelProps } from "../schema";
import { Box, Button, createListCollection, Input, Portal, Select, Text } from "@chakra-ui/react";

const channelTypes = createListCollection({
    items: [
        { value: "Text", label: "Text" },
        { value: "Voice", label: "Voice" },
        { value: "Forum", label: "Forum" },
        { value: "Announcement", label: "Announcement" },
        { value: "Stage", label: "Stage" }
    ],
})
const slowDownModes = createListCollection({
    items: [
        { value: "Off", label: "Off" },
        { value: "5", label: "5s" },
        { value: "10", label: "10s" },
        { value: "15", label: "15s" },
        { value: "30", label: "30s" },
    ],
})

export function ChannelForm({ onSubmit }: { onSubmit: (data: ChannelProps) => void }) {
    const [form, setForm] = useState<Partial<ChannelProps>>({
        type: "Text",
        name: "",
    });

    const [error, setError] = useState<string | null>(null);

    const update = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const type = form.type;

    const handleSubmit = () => {
        const result = ChannelSchema.safeParse(form);

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setError(null);
        onSubmit(result.data);
    };

    return (<>{/* TYPE SELECT */}
        <Select.Root size={"md"} collection={channelTypes}>
            <Select.HiddenSelect />
            <Select.Label>Channel Type</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Select channel type" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {channelTypes.items.map((type) => (
                            <Select.Item item={type} key={type.value}>
                                {type.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>

        {/* NAME */}
        < Box >
            <Text mb={1}>Name</Text>
            <Input
                value={form.name ?? ""}
                onChange={(e) => update("name", e.target.value)}
            />
        </Box >

        {/* CONDITIONAL FIELDS */}
        {
            type === "Text" && (
                <>
                    <Box>
                        <Text mb={1}>Topic</Text>
                        <Input
                            value={form.topic ?? ""}
                            onChange={(e) => update("topic", e.target.value)}
                        />
                    </Box>


                    <Select.Root size={"md"} collection={slowDownModes}>
                        <Select.HiddenSelect />
                        <Select.Label>Slow Mode Delay</Select.Label>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Select slow mode delay" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {slowDownModes.items.map((type) => (
                                        <Select.Item item={type} key={type.value}>
                                            {type.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </>
            )
        }

        {
            type === "Voice" && (
                <Box>
                    <Text mb={1}>User Limit</Text>
                    <Input
                        type="number"
                        value={form.userLimit ?? ""}
                        onChange={(e) => update("userLimit", Number(e.target.value))}
                    />
                </Box>
            )
        }

        {
            type === "Forum" && (
                <>
                    <Box>
                        <Text mb={1}>Topic</Text>
                        <Input
                            value={form.topic ?? ""}
                            onChange={(e) => update("topic", e.target.value)}
                        />
                    </Box>

                    <Box>
                        <Text mb={1}>Tags (comma separated)</Text>
                        <Input
                            value={(form.tags ?? []).join(", ")}
                            onChange={(e) =>
                                update(
                                    "tags",
                                    e.target.value.split(",").map((t) => t.trim())
                                )
                            }
                        />
                    </Box>
                </>
            )
        }

        {
            type === "Announcement" && (
                <Box>
                    <Text mb={1}>Topic</Text>
                    <Input
                        value={form.topic ?? ""}
                        onChange={(e) => update("topic", e.target.value)}
                    />
                </Box>
            )
        }

        {
            type === "Stage" && (
                <Box>
                    <Text mb={1}>User Limit</Text>
                    <Input
                        type="number"
                        value={form.userLimit ?? ""}
                        onChange={(e) => update("userLimit", Number(e.target.value))}
                    />
                </Box>
            )
        }

        {/* ERROR */}
        {
            error && (
                <Text color="red.400" fontSize="sm">
                    {error}
                </Text>
            )
        }

        {/* SUBMIT */}
        <Button colorScheme="blue" onClick={handleSubmit}>
            Save Channel
        </Button>
    </>
    );
}
