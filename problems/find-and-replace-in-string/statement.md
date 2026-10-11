You are given a base string `s` plus three parallel arrays describing candidate edits: `indices[i]` is a start position in `s`, `sources[i]` is the text expected at that position, and `targets[i]` is its replacement. Process all edits simultaneously against the original string:

- Sort the edits by their start index.
- Walk the original string from left to right. When you reach an edit whose source text exactly matches the substring of `s` beginning at its index, emit the replacement and skip past the matched source.
- If the source does not match there, leave that original character in place and continue (later edits still apply).
- Overlapping edits never both fire, because the walk only advances forward.

Return the final string.

**Example 1:**
```
Input: s = "abcd", indices = [0,2], sources = ["a","cd"], targets = ["eee","ffff"]
Output: "eeebffff"
Explanation: "a" matches at 0 and becomes "eee", then "b" is untouched, then "cd" matches at 2 and becomes "ffff".
```

**Example 2:**
```
Input: s = "abcd", indices = [0,2], sources = ["ab","ec"], targets = ["eee","ffff"]
Output: "eeecd"
Explanation: The first edit matches and yields "eee", but "ec" does not equal the "cd" at index 2, so the tail "cd" stays.
```

**Example 3:**
```
Input: s = "vmokgggqzp", indices = [3,5,1], sources = ["kg","nnn","mo"], targets = ["s","asa","b"]
Output: "vbsggqzp"
Explanation: After sorting by index, "mo" at index 1 becomes "b" and "kg" at index 3 becomes "s", while "nnn" does not match at index 5.
```

**Constraints:**
- `1 <= s.length <= 1000`
- `1 <= indices.length <= 100`
- `0 <= indices[i] < s.length`
- `1 <= sources[i].length, targets[i].length <= 50`
- All `indices` values are distinct
