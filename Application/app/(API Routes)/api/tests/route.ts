// regex-test.ts

import { makeCode } from "@/app/lib/encodeURL";

const BASE = "https://cusocialhub.vercel.app";


function shortenRawUrls(text: string) {
    return text.replace(/https?:\/\/\S+/g, (url) => {
        const code = makeCode(url);
        return `${BASE}/redirect/${code}?u=${encodeURIComponent(url)}`;
    });
}

function shortenInMarkdown(text: string) {
    // Single-line regex to prevent syntax errors and ensure accurate matching
    let out = text.replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, (match, label, url) => {
        const code = makeCode(url);
        const short = `${process.env.NEXT_PUBLIC_BASE_URL}/redirect/${code}?u=${encodeURIComponent(url)}`;
        return `[${label}](${short})`;
    });

    out = shortenRawUrls(out);

    return out;
}

// function shortenRawUrls(text: string) {
//     return text.replace(/https?:\/\/\S+/g, (url) => {
//         const code = makeCode(url);
//         return `${process.env.NEXT_PUBLIC_BASE_URL}/redirect/${code}?u=${encodeURIComponent(url)}`;
//     });
// }



function testMarkdownRegex(text: string) {
    // Escaped the literal brackets/parentheses and removed accidental spaces
    const regex = /\[(.*?)\]\((https?:\/\/.*?)\)/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
        console.log("Full match:", match[0]);
        console.log("Label:", match[1]);
        console.log("URL:", match[2]);
        console.log("----");
    }

    return text;
}

// 🔥 Test input
const sample = `
[Google](https://google.com)
[MATLAB Docs](https://www.mathworks.com/help/matlab/)
[MDN HTML Guide](https://developer.mozilla.org/en-US/docs/Web/HTML)
`;

// testMarkdownRegex(sample);
shortenInMarkdown(sample);
