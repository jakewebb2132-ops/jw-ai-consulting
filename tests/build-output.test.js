import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");

async function newestMtime(dir) {
  let newest = 0;
  let names;
  try {
    names = await readdir(dir, { recursive: true });
  } catch {
    return newest;
  }
  for (const name of names) {
    const info = await stat(path.join(dir, name));
    if (info.isFile() && info.mtimeMs > newest) newest = info.mtimeMs;
  }
  return newest;
}

describe("build output", () => {
  test("is newer than the sources it was built from", async () => {
    const built = await newestMtime(dist);
    const sources = await newestMtime(path.join(root, "src"));
    expect(built).toBeGreaterThanOrEqual(sources);
  });

  test("emits an entry document with the real title", async () => {
    const html = await readFile(path.join(dist, "index.html"), "utf8");
    expect(html).toContain("<title>JW AI Consulting | Elite Enterprise Intelligence</title>");
    expect(html).toContain('<div id="root">');
  });

  test("references only assets that exist on disk", async () => {
    const html = await readFile(path.join(dist, "index.html"), "utf8");
    const refs = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)]
      .map((m) => m[1])
      .filter((ref) => !ref.startsWith("//") && !ref.startsWith("/http"));

    expect(refs.length).toBeGreaterThan(0);
    for (const ref of refs) {
      const onDisk = path.join(dist, decodeURIComponent(ref).replace(/^\//, ""));
      await expect(
        stat(onDisk),
        `${ref} is referenced by dist/index.html but missing from dist/`,
      ).resolves.toBeTruthy();
    }
  });

  test("ships a non-trivial JS bundle", async () => {
    const html = await readFile(path.join(dist, "index.html"), "utf8");
    const entry = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
    expect(entry, "no hashed entry bundle referenced").toBeTruthy();
    const info = await stat(path.join(dist, entry.replace(/^\//, "")));
    expect(info.size).toBeGreaterThan(50_000);
  });
});
