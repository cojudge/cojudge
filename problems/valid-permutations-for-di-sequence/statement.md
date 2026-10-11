You receive a pattern string `s` of length `n` where each character is either `D` (the next number must drop) or `I` (the next number must climb). Consider shuffles of the numbers `0` through `n` inclusive: a shuffle is acceptable when every neighbouring pair obeys the corresponding letter.

Count the acceptable shuffles, giving the total modulo `10^9 + 7`.

**Constraints:**
- `n == s.length`
- `1 <= n <= 200`
- `s[i]` is `'I'` or `'D'`.
