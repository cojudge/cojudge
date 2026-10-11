You are given a string `s` and a positive integer `k`. Walk through the string from left to right in consecutive blocks of `2k` characters.

Within each block, flip the order of the first `k` characters and leave the remaining characters of that block untouched. When fewer than `k` characters remain at the end, flip all of them. When between `k` and `2k` characters remain, flip the first `k` and keep the rest as is.

Return the resulting string.

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` holds only lowercase English letters
- `1 <= k <= 10^4`
