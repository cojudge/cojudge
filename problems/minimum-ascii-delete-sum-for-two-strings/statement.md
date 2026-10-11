Given two strings, you may delete any characters from either string. Each deleted letter costs its ASCII code. After deletions the two results must read identically, and you want the smallest possible total price.

Keeping a shared subsequence for free while paying for everything else is the goal. For instance, turning `sea` into `eat` keeps `ea` and pays for one `s` plus one `t`.

Return the minimum deletion cost.

**Example 1:**
```
Input: s1 = "sea", s2 = "eat"
Output: 231
Explanation: Remove s (115) from the first word and t (116) from the second; 115 + 116 = 231.
```

**Example 2:**
```
Input: s1 = "delete", s2 = "leet"
Output: 403
Explanation: Preserve one copy of leet and pay for the leftover letters.
```

**Example 3:**
```
Input: s1 = "a", s2 = "b"
Output: 195
Explanation: Nothing matches, so delete both letters at 97 + 98.
```

**Constraints:**
- `1 <= s1.length, s2.length <= 1000`
- Both strings contain lowercase English letters.
