Two lowercase strings are given. The second string is formed by shuffling the characters of the first one and then inserting exactly one additional lowercase letter at some position. Identify which letter was inserted.

*Interface note:* the original statement returns a single character. In this repo every language models that answer as a one-character `string`, so return e.g. `"e"` rather than `'e'`.

**Constraints:**
- `0 <= s.length <= 1000`
- `t.length == s.length + 1`
- `s` and `t` contain only lowercase English letters.
