#!/usr/bin/env python3
"""Paraphrase audit: compare problems/<slug>/statement.md vs LeetCode original.
Sentence-level containment + global 8-gram overlap. JSON report to stdout/file."""
import json, os, re, sys, html
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CACHE = Path(os.environ.get("COJUDGE_WORK_DIR", "~/.cache/cojudge-work")).expanduser()
# Usage: paraphrase-audit.py [originals.json] [report.json]
# Defaults resolve under $COJUDGE_WORK_DIR (or ~/.cache/cojudge-work).
ORIGINALS = Path(sys.argv[1]) if len(sys.argv) > 1 else CACHE / "originals.json"
REPORT = Path(sys.argv[2]) if len(sys.argv) > 2 else CACHE / "paraphrase-report.json"
orig = json.load(open(ORIGINALS))

def strip_html(h):
    h = re.sub(r"<[^>]+>", " ", h or "")
    return html.unescape(h)

def toks(s):
    return re.findall(r"[a-z0-9]+", s.lower())

def sents(text):
    parts = re.split(r"[.?!;:\n]+", text)
    return [t.strip() for t in parts if len(toks(t)) >= 8]

def stmt_text(slug):
    p = REPO / "problems" / slug / "statement.md"
    if not os.path.exists(p):
        return ""
    t = open(p).read()
    t = re.sub(r"```.*?```", " ", t, flags=re.S)  # drop code blocks
    t = re.sub(r"[#*_`>\|-]", " ", t)
    return t

def ngrams(words, n):
    return {" ".join(words[i:i+n]) for i in range(len(words)-n+1)}

report = {}
slugs = sorted(d for d in os.listdir(REPO / "problems") if os.path.isdir(REPO / "problems" / d))
for slug in slugs:
    o = orig.get(slug, {})
    content = o.get("content", "")
    if not content:
        report[slug] = {"status": "no-original"}
        continue
    owords = toks(strip_html(content))
    oset = set(owords)
    osents = [toks(s) for s in sents(strip_html(content))]
    st = stmt_text(slug)
    swords = toks(st)
    ssents = sents(st)
    # sentence containment
    flagged = []
    for s in ssents:
        sw = toks(s)
        if not sw:
            continue
        best = 0.0
        for ow in osents:
            if not ow:
                continue
            inter = len(set(sw) & set(ow))
            best = max(best, inter / len(set(sw)))
        if best >= 0.75:
            flagged.append({"sent": s[:160], "overlap": round(best, 2)})
    # global 8-gram overlap
    if len(swords) >= 8:
        sg = ngrams(swords, 8)
        og = ngrams(owords, 8)
        gram = len(sg & og) / max(1, len(sg))
    else:
        gram = 0.0
    report[slug] = {
        "status": "ok",
        "n_sent": len(ssents),
        "n_flagged": len(flagged),
        "worst": max([f["overlap"] for f in flagged], default=0.0),
        "gram8": round(gram, 3),
        "flagged": flagged[:6],
    }

json.dump(report, open(REPORT, "w"), indent=1)
n_ok = sum(1 for v in report.values() if v["status"] == "ok")
n_no = sum(1 for v in report.values() if v["status"] == "no-original")
print(f"problems={len(report)} compared={n_ok} no-original={n_no}")
bad = sorted(
    [(s, v) for s, v in report.items() if v["status"] == "ok" and (v["n_flagged"] >= 3 or v["worst"] >= 0.9 or v["gram8"] >= 0.35)],
    key=lambda kv: (-kv[1]["n_flagged"], -kv[1]["worst"]),
)
print(f"flagged-problems={len(bad)}")
for s, v in bad[:40]:
    print(f"{s}: sent={v['n_sent']} flagged={v['n_flagged']} worst={v['worst']} gram8={v['gram8']}")
