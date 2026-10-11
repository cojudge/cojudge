You are given two strings: a longer text `haystack` and a shorter pattern `needle`. Locate the first position in `haystack` where the whole `needle` appears as a contiguous block, and return that starting index.

Return `-1` when `needle` never occurs inside `haystack`.

**Example 1:**
```
Input: haystack = "sadbutsad", needle = "sad"
Output: 0
Explanation: "sad" appears at index 0 and again at index 6; the first occurrence wins.
```

**Example 2:**
```
Input: haystack = "leetcode", needle = "leeto"
Output: -1
Explanation: No substring of "leetcode" equals "leeto".
```

**Constraints:**
- `1 <= haystack.length, needle.length <= 10^4`
- Both strings consist of lowercase English letters.
