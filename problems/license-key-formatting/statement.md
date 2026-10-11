A license key is written as letters, digits, and dashes. Reformat it in this way: drop every dash, turn lowercase letters into uppercase, then re-insert dashes so that each chunk holds exactly `k` characters, except the leading chunk which may be shorter but must not be empty. Dashes separate chunks and never appear at the ends.

Return the reformatted key.

**Example 1:**

```
Input: s = "5F3Z-2e-9-w", k = 4
Output: "5F3Z-2E9W"
Explanation: Stripped and uppercased text is 5F3Z2E9W (8 chars); two
chunks of 4 give 5F3Z-2E9W.
```

**Example 2:**

```
Input: s = "2-5g-3-J", k = 2
Output: "2-5G-3J"
Explanation: Stripped text is 25G3J; grouping from the right by 2 gives
2-5G-3J.
```

**Example 3:**

```
Input: s = "---a-a-a-", k = 1
Output: "A-A-A"
Explanation: Single-character chunks after cleanup.
```

**Constraints:**

- `1 <= s.length <= 10^5`
- `s` holds English letters, digits, and `-`.
- `1 <= k <= 10^4`
