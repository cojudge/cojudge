Count how many different non-empty subsequences a string has.

A subsequence is formed by erasing zero or more characters while keeping the order of the survivors. Two subsequences count as the same whenever their final texts match exactly, even if they were built from different positions. For instance, the two single `a` characters inside `"aba"` yield just one distinct subsequence `"a"`.

Given a string `s` of lowercase letters, return the number of distinct non-empty subsequences, modulo `10^9 + 7`.

**Constraints:**
- `1 <= s.length <= 2000`
- `s` holds lowercase English letters.
