You are given a string `s` and a positive integer `k`. Walk through the string from left to right in consecutive blocks of `2k` characters.

Within each block, flip the order of the first `k` characters and leave the remaining characters of that block untouched. When fewer than `k` characters remain at the end, flip all of them. When between `k` and `2k` characters remain, flip the first `k` and keep the rest as is.

Return the resulting string.

**Example 1:**
```
Input: s = "abcdefg", k = 2
Output: "bacdfeg"
Explanation: Blocks "ab","cd","ef","g" become "ba","dc","fe","g" with only first halves flipped, giving "bacdfeg".
```

**Example 2:**
```
Input: s = "abcd", k = 2
Output: "bacd"
Explanation: The first two characters are flipped and the last two stay.
```

**Example 3:**
```
Input: s = "a", k = 2
Output: "a"
Explanation: A lone character flipped is itself.
```

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` holds only lowercase English letters
- `1 <= k <= 10^4`
