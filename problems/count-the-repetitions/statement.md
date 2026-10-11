Write `[S, n]` for the string formed by repeating `S` exactly `n` times. Given strings `s1`, `s2` and counts `n1`, `n2`, consider `S1 = [s1, n1]`.

Count how many copies of `s2` appear in `S1` as a subsequence (characters in order, not necessarily adjacent), then divide that count by `n2` using integer division. In other words, find the largest `M` such that `[s2, M]` divided into groups of `n2` still fits, i.e. `M = (number of subsequence copies of s2 in S1) / n2` rounded down.

Return that value `M`.

**Constraints:**
- `1 <= s1.length, s2.length <= 100`
- `1 <= n1, n2 <= 10^6`
- `s1` and `s2` consist of lowercase English letters.
