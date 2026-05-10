"use client";

import { ChannelForm } from "@/lib/registries/channels/components/ChannelForm";

export default function NewChannel() {
    return (
        <>
            <h1>New Channel</h1>
            <ChannelForm onSubmit={(data) => {
                console.log("Validated channel:", data);

                // Example: send to API
                // await fetch("/api/channels", {
                //   method: "POST",
                //   body: JSON.stringify(data),
                // });

                // You can redirect or show a toast here
            }} />
        </>
    );

}