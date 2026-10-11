You are given a non-empty string `s`. Return `true` if `s` can be built by writing some shorter block two or more times in a row, and `false` otherwise.

**Example 1:**
```
Input: s = "abab"
Output: true
Explanation: The block "ab" appears twice in a row.
```

**Example 2:**
```
Input: s = "aba"
Output: false
Explanation: No block repeated whole times rebuilds the string.
```

**Example 3:**
```
Input: s = "abcabcabcabc"
Output: true
Explanation: The block "abc" appears four times in a row.
```

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` consists of lowercase English letters.
