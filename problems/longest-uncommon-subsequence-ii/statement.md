A subsequence keeps a selection of characters in their original order while possibly skipping others. A candidate string is uncommon when it appears as a subsequence of none of the other given strings.

Given an array `strs`, return the length of the longest string in `strs` that is not a subsequence of any other string in `strs`. Return `-1` when every string is a subsequence of some other string.

**Example 1:**
```
Input: strs = ["aba","cdc","eae"]
Output: 3
Explanation: All three strings have length 3 and none is a subsequence of another, so 3 is achievable.
```

**Example 2:**
```
Input: strs = ["aaa","aaa","aa"]
Output: 3
Explanation: "aaa" is not a subsequence of "aa", while "aa" is a subsequence of "aaa".
```

**Example 3:**
```
Input: strs = ["a","a","a"]
Output: -1
Explanation: Every string is a subsequence of another identical one.
```

**Constraints:**
- `1 <= strs.length <= 50`
- `1 <= strs[i].length <= 10`
- `strs[i]` consists of lowercase English letters
