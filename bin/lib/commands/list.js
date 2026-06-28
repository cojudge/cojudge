import path from "path";
import fs from "fs";
import { rootDir, getDifficultyOrder } from "../utils.js";
import { loadProgress } from "../progress.js";

export function listProblems() {
  const problemsPath = path.join(rootDir, "problems");
  const blind75Path = path.join(
    rootDir,
    "courses",
    "blind75",
    "courseinfo.json",
  );

  try {
    let orderedSlugs = [];
    if (fs.existsSync(blind75Path)) {
      const courseInfo = JSON.parse(fs.readFileSync(blind75Path, "utf8"));
      const categories = courseInfo["category-order"] || [];
      const categoryProblems = courseInfo["problems-of-category"] || {};

      categories.forEach((cat) => {
        const slugs = categoryProblems[cat] || [];
        const problemsWithMetadata = slugs.map((slug) => {
          const metaPath = path.join(problemsPath, slug, "metadata.json");
          let difficulty = "unknown";
          let title = slug;
          if (fs.existsSync(metaPath)) {
            try {
              const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
              difficulty = meta.difficulty || "unknown";
              title = meta.title || slug;
            } catch (e) {}
          }
          return { slug, difficulty, title };
        });

        problemsWithMetadata.sort((a, b) => {
          const diffA = getDifficultyOrder(a.difficulty);
          const diffB = getDifficultyOrder(b.difficulty);
          if (diffA !== diffB) return diffA - diffB;
          return a.title.localeCompare(b.title);
        });

        orderedSlugs.push(...problemsWithMetadata.map((p) => p.slug));
      });
    } else {
      orderedSlugs = fs
        .readdirSync(problemsPath)
        .filter((f) => {
          return fs.statSync(path.join(problemsPath, f)).isDirectory();
        })
        .sort();
    }

    const progress = loadProgress();
    const solved = new Set(progress.solvedSlugs || []);

    console.log(
      "Available problem slugs (ordered by Blind 75 categories & difficulty):",
    );
    orderedSlugs.forEach((s) => {
      const mark = solved.has(s) ? "\u2705" : "  ";
      console.log(`  ${mark} ${s}`);
    });

    const allFolders = fs.readdirSync(problemsPath).filter((f) => {
      return fs.statSync(path.join(problemsPath, f)).isDirectory();
    });
    const extraSlugs = allFolders
      .filter((f) => !orderedSlugs.includes(f))
      .sort();

    if (extraSlugs.length > 0) {
      console.log("\nOther problems:");
      extraSlugs.forEach((s) => {
        const mark = solved.has(s) ? "\u2705" : "  ";
        console.log(`  ${mark} ${s}`);
      });
    }

    const totalCount = orderedSlugs.length + extraSlugs.length;
    console.log(
      `\nProgress: ${solved.size}/${totalCount} (${Math.round((solved.size / totalCount) * 100)}%)`,
    );
  } catch (e) {
    console.error("Could not list problems:", e.message);
  }
}
