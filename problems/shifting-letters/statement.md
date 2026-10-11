Shift the letters of a string by suffix totals.

You receive a lowercase string `s` and an array `shifts` of the same length. Conceptually, `shifts[i]` says how many forward steps (wrapping from z back to a) apply to the prefix ending at `i`; equivalently each position `i` moves by the sum of `shifts[j]` for all `j >= i`. Apply all shifts with modulo 26 and return the resulting string.

**Constraints:**
- `1 <= s.length <= 10^5`
- `s` holds lowercase English letters.
- `shifts.length == s.length`
- `0 <= shifts[i] <= 10^9`
