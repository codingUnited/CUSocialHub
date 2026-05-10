"use client";

import { ChannelForm } from "@/lib/registries/channels/components/ChannelForm";

export default function Admin() {
    return (
        <>
            <h1>Admin Page</h1>
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