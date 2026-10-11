You start on position `0` of a binary string `s` indexed from zero; that starting character is `'0'`. Two integers `minJump` and `maxJump` bound each leap. A leap from position `i` to position `j` is allowed exactly when:

- `i + minJump <= j <= min(i + maxJump, s.length - 1)`, and
- `s[j] == '0'`.

Decide whether position `s.length - 1` can be reached through a chain of allowed leaps.

**Constraints:**

- `2 <= s.length <= 10^5`
- `s[i]` is either `'0'` or `'1'`.
- `s[0] == '0'`
- `1 <= minJump <= maxJump < s.length`
