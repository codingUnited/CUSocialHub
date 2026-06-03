import crypto from "crypto";

export function makeCode(url: string) {
    return crypto
        .createHash("sha256")
        .update(url)
        .digest("base64url")
        .slice(0, 4); // short, stable code
}
