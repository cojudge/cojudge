#!/usr/bin/env python3
"""Remove Example sections from statement.md (examples render from metadata.json).
Only removes sections headed by **Example N:** / **Examples:** that contain
'Input:'. Keeps adaptation notes, diagrams, inline prose. Supports --apply."""
import os, re, sys

REPO = "/home/deck/CS/cojudge"
HDR = re.compile(r"^\*\*(Example \d+|Examples):\*\*\s*$")
ANYHDR = re.compile(r"^\*\*.+:\*\*\s*$")
HEADING = re.compile(r"^#+\s")

def strip(text):
    lines = text.split("\n")
    out = []
    i = 0
    removed = 0
    while i < len(lines):
        if HDR.match(lines[i]):
            j = i + 1
            while j < len(lines) and not (
                ANYHDR.match(lines[j]) or HEADING.match(lines[j])
            ):
                j += 1
            chunk = "\n".join(lines[i:j])
            if "Output:" in chunk:
                removed += 1
                i = j
                continue
            # no Output: -> keep, report (shouldn't happen)
            print(f"  KEEP (no Output:): {lines[i]}")
            out.append(lines[i])
            i += 1
        else:
            out.append(lines[i])
            i += 1
    text = "\n".join(out)
    text = re.sub(r"\n{3,}", "\n\n", text).strip() + "\n"
    return text, removed

def main():
    apply = "--apply" in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    slugs = only or sorted(
        d for d in os.listdir(f"{REPO}/problems") if os.path.isdir(f"{REPO}/problems/{d}")
    )
    changed, total_rm = 0, 0
    for slug in slugs:
        p = f"{REPO}/problems/{slug}/statement.md"
        if not os.path.exists(p):
            continue
        orig = open(p).read()
        if "Example" not in orig:
            continue
        new, removed = strip(orig)
        if removed:
            changed += 1
            total_rm += removed
            if apply:
                open(p, "w").write(new)
    print(f"files with removals: {changed}, sections removed: {total_rm}, apply={apply}")

main()
