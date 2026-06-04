import { redirect } from "next/navigation";

export default function Redirect() {
    redirect("/polls");
}


// "use client";

// import { ChannelForm } from "@/lib/registries/channels/components/ChannelForm";
// import { Card, Container } from "@chakra-ui/react/";

// export default function NewChannel() {
//     return (
//         <>
//             <h1>New Channel</h1>

//             <Container w={"container.sm"}>
//                 <Card.Root variant={"outline"}>
//                     <Card.Body>

//                         <ChannelForm onSubmit={(data) => {
//                             console.log("Validated channel:", data);

//                             // Example: send to API
//                             // await fetch("/api/channels", {
//                             //   method: "POST",
//                             //   body: JSON.stringify(data),
//                             // });

//                             // You can redirect or show a toast here
//                         }} />
//                     </Card.Body>
//                 </Card.Root>
//             </Container>

//         </>
//     );

// }