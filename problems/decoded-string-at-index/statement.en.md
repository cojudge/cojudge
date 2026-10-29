You are given an encoded string `s` made of lowercase letters and digits from `2` to `9`. It decodes by scanning left to right with an initially empty tape: each letter is appended to the tape, while each digit `d` repeats the entire current tape `d - 1` more times (so the tape becomes `d` copies of itself).

Given a 1-based index `k`, return the character sitting at position `k` of the fully decoded tape. The inputs guarantee that position exists, so never build the whole tape — it can be enormous.

**Constraints:**
- `2 <= s.length <= 100`
- `s` contains only lowercase letters and digits `2` through `9`.
- `s` starts with a letter and every digit follows a non-empty tape.
- `1 <= k <= 10^9`
- The decoded tape holds at least `k` characters.
