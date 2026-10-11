Consider two strings `s` and `t`. Count how many different ways `t` can be obtained from `s` by removing characters.

Only deletions are allowed: keep a subsequence of `s` in its original order, discarding zero or more characters, and check whether what remains matches `t` exactly. Each distinct set of kept positions that spells `t` counts separately. The final count is known to fit inside a signed 32-bit integer.

**Constraints:**
- Both lengths satisfy `1 <= s.length, t.length <= 1000`.
- `s` and `t` consist solely of uppercase and lowercase English letters.
