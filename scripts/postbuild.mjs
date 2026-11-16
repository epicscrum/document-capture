// Marks each emitted tree with its module type so Node resolves ESM and CJS correctly.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
writeFileSync(join(dist, "esm", "package.json"), JSON.stringify({ type: "module" }) + "\n");
writeFileSync(join(dist, "cjs", "package.json"), JSON.stringify({ type: "commonjs" }) + "\n");
