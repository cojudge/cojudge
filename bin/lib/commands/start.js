import path from "path";
import fs from "fs";
import { rootDir, getPIDs, openBrowser, getLangFromExt, getPort } from "../utils.js";
import { startServer } from "../server.js";

export function handleStart(argsToUse, PORT) {
  let slug = argsToUse[1];
  let filename = argsToUse[2];

  if (
    slug &&
    !filename &&
    fs.existsSync(slug) &&
    !fs.existsSync(path.join(rootDir, "problems", slug))
  ) {
    filename = slug;
    slug = "playground";
  }

  let browserPath = "";

  if (filename && !fs.existsSync(filename)) {
    console.error(`Error: File '${filename}' does not exist.`);
    process.exit(1);
  }

  if (slug) {
    if (slug === "playground") {
      browserPath = "/playground";
    } else {
      browserPath = `/problems/${slug}`;
    }

    if (filename) {
      const ext = path.extname(filename);
      const lang = getLangFromExt(ext);
      const name = path.basename(filename);
      let content = "";

      try {
        content = fs.readFileSync(filename, "utf8");
      } catch (e) {
        console.warn(`Could not read file ${filename}: ${e.message}`);
      }

      browserPath += `?tabs=${encodeURIComponent(JSON.stringify([{ name, lang, content }]))}`;
    }
  }

  const pids = getPIDs(PORT);
  if (pids.length > 0) {
    openBrowser(PORT, browserPath);
    setTimeout(() => process.exit(0), 1000);
  } else {
    startServer(PORT, () => openBrowser(PORT, browserPath));
  }
}
