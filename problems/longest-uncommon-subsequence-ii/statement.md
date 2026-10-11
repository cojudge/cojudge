A subsequence keeps a selection of characters in their original order while possibly skipping others. A candidate string is uncommon when it appears as a subsequence of none of the other given strings.

Given an array `strs`, return the length of the longest string in `strs` that is not a subsequence of any other string in `strs`. Return `-1` when every string is a subsequence of some other string.

**Constraints:**
- `1 <= strs.length <= 50`
- `1 <= strs[i].length <= 10`
- `strs[i]` consists of lowercase English letters
