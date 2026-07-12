import https from "https";

const GRAPHQL_URL = "https://leetcode.com/graphql";
const ALGORITHMS_API_URL = "https://leetcode.com/api/problems/algorithms/";

function graphql(query, variables) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    const url = new URL(GRAPHQL_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "cojudge/1.0",
      },
    };
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: { "User-Agent": "cojudge/1.0" },
    };
    https.get(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    }).on("error", reject);
  });
}

function cleanHtml(text) {
  return text.replace(/<[^>]+>/g, "").trim();
}

function parseExamples(content) {
  const examples = [];
  const pattern = /<p><strong class="example">Example (\d+):<\/strong><\/p>\s*<pre>\s*(.*?)\s*<\/pre>/gs;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const text = cleanHtml(match[1]);
    const body = cleanHtml(match[2]);
    const inputMatch = body.match(/Input:\s*(.+)/);
    const outputMatch = body.match(/Output:\s*(.+)/);
    const explanationMatch = body.match(/Explanation:\s*(.+)/);
    examples.push({
      number: parseInt(text),
      input: inputMatch ? inputMatch[1].trim() : "",
      output: outputMatch ? outputMatch[1].trim() : "",
      explanation: explanationMatch ? explanationMatch[1].trim() : null,
    });
  }
  return examples;
}

function parseConstraints(content) {
  const match = content.match(
    /<p><strong>Constraints:<\/strong><\/p>\s*<ul>(.*?)<\/ul>/s,
  );
  if (!match) return [];
  const items = match[1].match(/<li>(.*?)<\/li>/gs);
  if (!items) return [];
  return items.map((item) => cleanHtml(item));
}

function parseDescription(content) {
  const match = content.match(
    /<p>(.*?)(?=<p><strong class="example">|<p><strong>Constraints:|$)/s,
  );
  if (!match) return "";
  return cleanHtml(match[1]);
}

function mapLcType(type) {
  const map = {
    "integer": "int",
    "integer[]": "int_array",
    "integer[][]": "int_arrayarray",
    "string": "string",
    "string[]": "string_array",
    "boolean": "boolean",
    "boolean[]": "boolean_array",
    "double": "double",
    "character": "char",
    "ListNode": "linked_list_node",
    "TreeNode": "tree_node",
  };
  return map[type] || "string";
}

const COJUDGE_LANGS = ["java", "python3", "cpp", "csharp", "golang", "rust", "typescript"];
const LANG_ALIAS = {
  python3: "python",
};

function extractSnippets(snippets) {
  const result = {};
  for (const s of snippets) {
    const key = LANG_ALIAS[s.langSlug] || s.langSlug;
    if (COJUDGE_LANGS.includes(s.langSlug)) {
      result[key] = s.code;
    }
  }
  return result;
}

function formatExampleTestcases(raw) {
  if (!raw) return [];
  const lines = raw.split("\n").filter((l) => l.trim());
  const groups = [];
  let current = [];
  for (const line of lines) {
    current.push(line);
    if (current.length >= 2) {
      groups.push(current);
      current = [];
    }
  }
  if (current.length) groups.push(current);
  return groups;
}

export async function scrapeProblem(slug) {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        title
        titleSlug
        content
        difficulty
        topicTags { name }
        codeSnippets { lang langSlug code }
        exampleTestcases
        hints
        metaData
      }
    }
  `;
  const response = await graphql(query, { titleSlug: slug });
  const q = response.data?.question;
  if (!q) throw new Error(`Problem "${slug}" not found`);

  const metaData = JSON.parse(q.metaData || "{}");
  const content = q.content || "";

  return {
    number: parseInt(q.questionFrontendId),
    title: q.title,
    slug: q.titleSlug,
    difficulty: q.difficulty,
    topics: (q.topicTags || []).map((t) => t.name),
    hints: q.hints || [],
    metaData: {
      functionName: metaData.name || "unknown",
      params: (metaData.params || []).map((p) => ({
        name: p.name,
        type: p.type,
        mappedType: mapLcType(p.type),
      })),
      returnType: metaData.return?.type || "unknown",
      mappedReturnType: mapLcType(metaData.return?.type || "void"),
    },
    description: parseDescription(content),
    examples: parseExamples(content),
    constraints: parseConstraints(content),
    snippets: extractSnippets(q.codeSnippets || []),
    exampleTestcases: formatExampleTestcases(q.exampleTestcases),
  };
}

export async function getSlugByNumber(number) {
  const data = await fetchJson(ALGORITHMS_API_URL);
  for (const pair of data.stat_status_pairs || []) {
    if (pair.stat.frontend_question_id === number) {
      return pair.stat.question__title_slug;
    }
  }
  return null;
}

export async function formatScrapeOutput(problem) {
  const lines = [];
  lines.push("=".repeat(60));
  lines.push(
    `  #${problem.number} ${problem.title}  [${problem.difficulty}]`,
  );
  lines.push("=".repeat(60));
  lines.push(`  Slug: ${problem.slug}`);
  lines.push(`  Topics: ${problem.topics.join(", ")}`);
  lines.push("");

  const md = problem.metaData;
  lines.push("--- Function Signature ---");
  const paramsStr = md.params
    .map((p) => `${p.name}: ${p.type}  →  cojudge: ${p.mappedType}`)
    .join("\n");
  lines.push(`  Name: ${md.functionName}`);
  lines.push(`  Params:\n${paramsStr}`);
  lines.push(`  Return: ${md.returnType}  →  cojudge: ${md.mappedReturnType}`);
  lines.push("");

  lines.push("--- Description ---");
  lines.push(`  ${problem.description}`);
  lines.push("");

  if (problem.examples.length) {
    lines.push("--- Examples ---");
    for (const ex of problem.examples) {
      lines.push(`  Example ${ex.number}:`);
      lines.push(`    Input: ${ex.input}`);
      lines.push(`    Output: ${ex.output}`);
      if (ex.explanation) lines.push(`    Explanation: ${ex.explanation}`);
    }
    lines.push("");
  }

  if (problem.constraints.length) {
    lines.push("--- Constraints ---");
    for (const c of problem.constraints) {
      lines.push(`  - ${c}`);
    }
    lines.push("");
  }

  if (problem.hints.length) {
    lines.push("--- Hints ---");
    for (let i = 0; i < problem.hints.length; i++) {
      lines.push(`  ${i + 1}. ${cleanHtml(problem.hints[i])}`);
    }
    lines.push("");
  }

  if (problem.exampleTestcases.length) {
    lines.push("--- Example Test Inputs (no expected output) ---");
    for (const group of problem.exampleTestcases) {
      lines.push(`  ${group.join(" ")}`);
    }
    lines.push("");
  }

  const langs = Object.entries(problem.snippets);
  if (langs.length) {
    lines.push("--- Starter Code (cojudge-supported languages) ---");
    for (const [lang, code] of langs) {
      lines.push(`\n[${lang}]`);
      lines.push(code);
    }
    lines.push("");
  }

  lines.push("=".repeat(60));
  lines.push("Suggested cojudge problem creation:");
  lines.push(
    `  mkdir -p problems/${problem.slug}`,
  );
  lines.push(
    `  cojudge scrape -s ${problem.slug} > problems/${problem.slug}/scraped.txt`,
  );
  lines.push(`  # Then create statement.md, metadata.json, official-tests.json, Marker.java`);
  lines.push("");
  lines.push("metadata.json suggestions:");
  lines.push(`  id: "${problem.slug}"`);
  lines.push(`  title: "${problem.number}. ${problem.title}"`);
  lines.push(`  difficulty: "${problem.difficulty}"`);
  lines.push(`  category: "${(problem.topics[0] || "").toLowerCase().replace(/ /g, "-")}"`);
  lines.push(`  functionName: "${md.functionName}"`);
  lines.push(`  params:`);
  for (const p of md.params) {
    lines.push(`    - { name: "${p.name}", type: "${p.mappedType}" }`);
  }
  lines.push(`  outputType: "${md.mappedReturnType}"`);
  lines.push(`  link: "https://leetcode.com/problems/${problem.slug}/"`);

  return lines.join("\n");
}
