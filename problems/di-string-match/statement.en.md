Rebuild a permutation from its up/down pattern.

You are given a pattern string `s` whose characters are `I` (the next number goes up) and `D` (the next number goes down). Build any ordering `perm` of the integers `0` through `n` (where `n` is the pattern length) such that each neighbouring pair obeys the pattern: `perm[i] < perm[i+1]` wherever `s[i]` is `I`, and `perm[i] > perm[i+1]` wherever it is `D`. Many orderings may qualify; return any one of them.

**Constraints:**
- `1 <= s.length <= 10^5`
- Each character of `s` is `I` or `D`.
