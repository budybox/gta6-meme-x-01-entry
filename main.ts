// Entry program for the GTA 6 meme bounty (gta6-meme-x-01).
//
// The post itself is the entry: the house reads it from X and builds the
// dossier the judge sees. All this program has to do is hand the post's
// address over, by copying POST.json from the repository into the output
// directory the grader gives it.
//
// It reads exactly two things from the environment, both directories:
//   MAKEFUN_BOT_DIR     - the repository root (where POST.json lives)
//   MAKEFUN_OUTPUT_DIR  - where the copy has to land
// No network, no clock, no files outside those two directories, so the
// two grading runs always write the same bytes.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

const source = join(botDir, "POST.json");
const target = join(outputDir, "POST.json");

// Read the post file first and check it really names an X post, so a
// typo in POST.json fails loudly here instead of silently shipping a
// bad address to the grader.
const text = readFileSync(source, "utf8");
const post = JSON.parse(text) as unknown;
if (
  typeof post !== "object" ||
  post === null ||
  typeof (post as { url?: unknown }).url !== "string" ||
  !/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/\S+\/status\/\d+$/.test(
    (post as { url: string }).url,
  )
) {
  throw new Error("POST.json does not hold an X post address");
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(target, text);
