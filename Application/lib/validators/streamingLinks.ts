import { z } from "zod";

export const ALLOWED_STREAMING_PREFIXES = [
    "https://www.hbomax.com/movies/",
    "https://www.hulu.com/hub/movies/",
    "https://www.peacocktv.com/stream/movies/",
    "https://www.netflix.com/title",
    "https://movies.disney.com/",
    "https://www.amazon.com/gp/video/movie",
    "https://www.paramountplus.com/movies/"
];

export const StreamingLinkSchema = z
    .url("Must be a valid URL.")
    .refine(
        (url) =>
            ALLOWED_STREAMING_PREFIXES.some((prefix) =>
                url.toLowerCase().startsWith(prefix.toLowerCase())
            ),
        {
            message: "URL must be from an approved streaming service."
        }
    );
