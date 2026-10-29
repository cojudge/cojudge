A *generalized abbreviation* of a word is formed by replacing any set of non-overlapping substrings with their lengths, leaving the remaining letters in place. For instance, from `word` one can produce `4`, `3d`, `2r1`, `1o2`, or keep `word` itself (replacing nothing).

Given a word, return every distinct generalized abbreviation of it, in any order.

**Constraints:**
- `1 <= word.length <= 15`
- `word` consists of lowercase English letters.
