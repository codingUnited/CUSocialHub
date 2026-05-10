import { NextRequest, NextResponse } from "next/server";

export const GET = async () => { };
export const POST = async (req: NextRequest) => {
  return new Response('Hello from the Discord Interactions API route!', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  })

};
export const PUT = async () => { };
export const PATCH = async () => { };
export const DELETE = async () => { };
export const HEAD = async () => { };
export const OPTIONS = async () => { };

export const runtime = 'edge'
