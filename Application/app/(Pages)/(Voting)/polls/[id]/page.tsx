import PollPageClient from "./PollPageClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // unwrap on the server
    return <PollPageClient id={id} />;
}
