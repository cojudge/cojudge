You are given a lowercase string `s` and an integer `k`. Reorder its
characters into a new string where any two equal letters are separated by at
least `k` positions (there must be `k - 1` other characters between them).
When no such ordering exists, return the empty string.

For example, `"aabbcc"` with `k = 3` can become `"abcabc"`, while `"aaabc"`
with `k = 3` is impossible because three `a` letters need at least
`3 + 2 * (3 - 1) = 7` slots but only 5 characters exist.

Note that many orderings may be valid; any correct one is accepted.

**Constraints:**
- `1 <= s.length <= 500`
- `s` consists of lowercase English letters
- `1 <= k <= s.length`
