import fs from "fs";
import {
  ensureUserContentSeededSync,
  listProblemSlugsSync,
  resolveProblemFileSync,
} from "../contentPaths.js";

export function handleSearch(args) {
  ensureUserContentSeededSync();
  const keyword = args[1];
  if (!keyword) {
    console.error("Error: Please specify a keyword to search for.");
    console.error("Usage: cojudge search <keyword>");
    return;
  }

  const slugs = listProblemSlugsSync();

  const lowerKeyword = keyword.toLowerCase();
  let results = [];

  for (const slug of slugs) {
    const metaPath = resolveProblemFileSync(slug, "metadata.json");
    const statementPath = resolveProblemFileSync(slug, "statement.md");

    const meta = fs.existsSync(metaPath)
      ? JSON.parse(fs.readFileSync(metaPath, "utf8"))
      : {};
    const title = meta.title || slug;
    const id = meta.id || slug;

    const matches = [];

    if (slug.toLowerCase().includes(lowerKeyword)) {
      matches.push(`slug: "${slug}"`);
    }
    if (title.toLowerCase().includes(lowerKeyword)) {
      matches.push(`title: "${title}"`);
    }
    if (fs.existsSync(statementPath)) {
      const statement = fs.readFileSync(statementPath, "utf8");
      if (statement.toLowerCase().includes(lowerKeyword)) {
        const lines = statement.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].toLowerCase().includes(lowerKeyword)) {
            matches.push(`statement:${i + 1}: ${lines[i].trim()}`);
          }
        }
      }
    }

    if (matches.length > 0) {
      results.push({ slug, title, matches });
    }
  }

  if (results.length === 0) {
    console.log(`No problems found matching "${keyword}".`);
    return;
  }

  console.log(`Found ${results.length} problem(s) matching "${keyword}":\n`);
  for (const r of results) {
    console.log(`  ${r.title}`);
    console.log(`    slug: ${r.slug}`);
    for (const m of r.matches) {
      console.log(`    ${m}`);
    }
    console.log();
  }
}
