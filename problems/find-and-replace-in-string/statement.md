You are given a base string `s` plus three parallel arrays describing candidate edits: `indices[i]` is a start position in `s`, `sources[i]` is the text expected at that position, and `targets[i]` is its replacement. Process all edits simultaneously against the original string:

- Sort the edits by their start index.
- Walk the original string from left to right. When you reach an edit whose source text exactly matches the substring of `s` beginning at its index, emit the replacement and skip past the matched source.
- If the source does not match there, leave that original character in place and continue (later edits still apply).
- Overlapping edits never both fire, because the walk only advances forward.

Return the final string.

**Constraints:**
- `1 <= s.length <= 1000`
- `1 <= indices.length <= 100`
- `0 <= indices[i] < s.length`
- `1 <= sources[i].length, targets[i].length <= 50`
- All `indices` values are distinct
