// app/api/discord/resources/humble-bundle/filter/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';

type Bundle = {
    id: string;
    title: string;
    category: string;
    url: string;
    endDate: string;
    blurb: string;
};

export const HUMBLE_KEYWORDS = [
    "python",
    // "java",
    // "javascript",
    // "c#",
    // "ruby",
    // "go",
    // "rust",
    // "php",
    // "swift",
    // "kotlin",
    // "typescript",
    // "linux",
    // "windows",
    // "macos",
    // "android",
    // "ios",
    // "web development",
    // "machine learning",
    // "data science",
    // "artificial intelligence",
    // "cloud computing",
    // "cybersecurity",
    // "blockchain",
    // "devops",
    // "docker",
    // "kubernetes",
    // "aws",
    // "azure",
    // "google cloud",
    // "git",
    // "github",
    // "gitlab",
    // "bitbucket",
    // "programming",
    // "coding",
    // "software development",
    // "open source",
    // "technology",
    // "tech news",
    // "no starch press",
    // "o'reilly",
    // "packt",
    // "wiley",
    // "unity",
    // "unreal",
    // "python",
    // "ai",
    // "machine learning",
    // "godot",
    // "c#",
    // "javascript",
    // "web dev",
    // "game dev",
    // "3d",
    // "blender",
    // "cybersecurity",
    // "linux",
    // "cloud",
    // "aws",
    // "azure"
];

export async function GET(req: Request) {
    try {
        // 1. Fetch the raw bundles from scraper route
        const base = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/discord/resources/humble-bundle`);
        const { data: bundles } = await base.json();

        // 2. Normalize Keywords list
        const keywords = HUMBLE_KEYWORDS.map(k => k.toLowerCase());

        // 2. Filter by keywords
        const filtered = bundles.filter((bundle: Bundle) => {
            const text = `${bundle.title} ${bundle.blurb}`.toLowerCase();
            return keywords.some(keyword => text.includes(keyword));
        });

        return NextResponse.json({
            success: true,
            count: filtered.length,
            data: filtered
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }

} 
