Given a string `s` and a non-negative integer `k`, find the length of the longest contiguous block that uses no more than `k` different characters.

A block is any run of consecutive positions. When `k` is zero, or `s` is empty, no non-empty block qualifies and the answer is zero.

**Example 1:**
```
Input: s = "eceba", k = 2
Output: 3
Explanation: The opening block "ece" uses two distinct letters and has length 3, which no longer block with two letters beats.
```

**Example 2:**
```
Input: s = "aa", k = 1
Output: 2
Explanation: Both characters are the same, so the whole string of length 2 qualifies.
```

**Example 3:**
```
Input: s = "abc", k = 5
Output: 3
Explanation: The limit exceeds the alphabet present, so the entire string qualifies.
```

**Constraints:**
- `0 <= s.length <= 10^4`
- `0 <= k <= 100`
- `s` consists of printable ASCII characters.
