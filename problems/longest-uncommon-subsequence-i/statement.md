A subsequence keeps a selection of characters in their original order while possibly skipping others. A subsequence of one string is called uncommon when it never appears as a subsequence of the other string.

Given two strings `a` and `b`, return the length of the longest subsequence of one string that is not a subsequence of the other. Return `-1` when no such subsequence exists.

**Example 1:**
```
Input: a = "aba", b = "cdc"
Output: 3
Explanation: "aba" itself is not a subsequence of "cdc", so the full length 3 qualifies.
```

**Example 2:**
```
Input: a = "aaa", b = "bbb"
Output: 3
Explanation: Either whole string is absent from the other side.
```

**Example 3:**
```
Input: a = "aaa", b = "aaa"
Output: -1
Explanation: Both strings share exactly the same subsequences.
```

**Constraints:**
- `1 <= a.length, b.length <= 100`
- `a` and `b` consist of lowercase English letters
