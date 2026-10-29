Given a decimal string `n` (no leading zeros except `"0"` itself), return the closest palindromic integer different from `n` itself, as a string. Closeness is measured by absolute numeric difference; when two palindromes tie, pick the smaller one.

Only the value matters, not the spelling: candidates are built by mirroring a prefix. Also consider the powers-of-ten neighbors (`99..9` and `100..01`), which cover length changes the mirroring may miss.

**Constraints:**
- `1 <= n.length <= 18`
- `n` has no leading zeros.
- `n` fits in a signed 64-bit integer.
