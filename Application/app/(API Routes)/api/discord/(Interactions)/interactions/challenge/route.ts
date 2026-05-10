import { NextRequest } from 'next/server'

export async function GET(_: NextRequest) {
    return new Response('Hello from the Discord Interactions API route!', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
    })
}

export const runtime = 'edge'
