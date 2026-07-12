import { scrapeProblem, getSlugByNumber, formatScrapeOutput } from "../scrape.js";

export async function handleScrape(args) {
  const nIdx = args.indexOf("-n");
  const sIdx = args.indexOf("-s");
  let slug = null;

  if (nIdx !== -1 && args[nIdx + 1]) {
    const number = parseInt(args[nIdx + 1]);
    if (isNaN(number)) {
      console.error("Error: -n requires a numeric problem number.");
      process.exit(1);
    }
    console.error(`Fetching problem #${number}...`);
    slug = await getSlugByNumber(number);
    if (!slug) {
      console.error(`Error: Problem #${number} not found.`);
      process.exit(1);
    }
  } else if (sIdx !== -1 && args[sIdx + 1]) {
    slug = args[sIdx + 1];
  } else {
    console.error("Usage: cojudge scrape -n <number> | -s <slug>");
    process.exit(1);
  }

  console.error(`Fetching "${slug}" from LeetCode...`);
  try {
    const problem = await scrapeProblem(slug);
    const output = await formatScrapeOutput(problem);
    console.log(output);
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}
