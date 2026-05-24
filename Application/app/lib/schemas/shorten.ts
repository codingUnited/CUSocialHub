import { z } from "zod";

export const ShortenSchema = z.object({
  url: z.url(),
});
