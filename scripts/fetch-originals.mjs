#!/usr/bin/env node
// Fetch LeetCode original HTML content for slugs (reference for paraphrase audit).
// Usage: node fetch-originals.mjs slugs.txt out.json
// Resumes: skips slugs already in out.json.
import https from "https";
import fs from "fs";
import os from "os";

const slugs = fs.readFileSync(process.argv[2], "utf8").split(/\r?\n/).filter(Boolean);
const outPath = process.argv[3];
let done = {};
if (fs.existsSync(outPath)) {
  try { done = JSON.parse(fs.readFileSync(outPath, "utf8")); } catch {}
}

function graphql(query, variables) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    const req = https.request(
      { hostname: "leetcode.com", path: "/graphql", method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "cojudge/1.0" } },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

const query = `query q($titleSlug: String!) {
  question(titleSlug: $titleSlug) { titleSlug title content }
}`;

let idx = 0, ok = 0, fail = 0;
const total = slugs.length;
async function worker() {
  while (true) {
    const i = idx++;
    if (i >= total) break;
    const slug = slugs[i];
    if (done[slug]) continue;
    try {
      const r = await graphql(query, { titleSlug: slug });
      const q = r.data?.question;
      done[slug] = q ? { title: q.title, content: q.content || "" } : { title: "", content: "", error: "notfound" };
      ok++;
    } catch (e) {
      fail++;
      done[slug] = { title: "", content: "", error: String(e).slice(0, 80) };
    }
    if ((ok + fail) % 50 === 0) {
      console.error(`progress ${ok + fail}/${total} (have ${Object.keys(done).length})`);
      fs.writeFileSync(outPath, JSON.stringify(done));
    }
    await new Promise((r) => setTimeout(r, 150));
  }
}
await Promise.all([...Array(6)].map(() => worker()));
fs.writeFileSync(outPath, JSON.stringify(done));
console.error(`DONE ok=${ok} fail=${fail} total=${Object.keys(done).length}`);
