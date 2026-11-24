import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "In Wobbleton, showers all morning, umbrellas turning inside out. The bus shelter leaks in exactly one place: yours.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > 140) {
  console.error(`line must be 1-140 characters, got ${LINE.length}`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("line must not be only whitespace");
  process.exit(1);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("line must be a single line");
  process.exit(1);
}

// Ties break on bytes, so assert the byte length too: the line is pure
// ASCII, so bytes must equal characters.
const byteLength = Buffer.byteLength(LINE, "utf8");
if (byteLength !== LINE.length) {
  console.error(`line must be ASCII (bytes ${byteLength} != chars ${LINE.length})`);
  process.exit(1);
}
if (byteLength < 1 || byteLength > 140) {
  console.error(`line must be 1-140 bytes, got ${byteLength}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");

// Read back and confirm the file holds exactly the line, byte for byte.
const written = readFileSync(target, "utf8");
if (written !== LINE) {
  console.error("read-back mismatch: entry.txt does not hold the line exactly");
  process.exit(1);
}
