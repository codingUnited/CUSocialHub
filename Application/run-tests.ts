import { readdirSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";

const testDir = join(process.cwd(), "tests");
const files = readdirSync(testDir).filter(f => f.endsWith(".test.ts"));

(async () => {
    for (const file of files) {
        console.log(`\n=== Running ${file} ===`);

        const fullPath = join(testDir, file);
        const fileUrl = pathToFileURL(fullPath).href;

        await import(fileUrl);
    }
})();
