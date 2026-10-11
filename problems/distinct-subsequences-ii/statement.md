Count how many different non-empty subsequences a string has.

A subsequence is formed by erasing zero or more characters while keeping the order of the survivors. Two subsequences count as the same whenever their final texts match exactly, even if they were built from different positions. For instance, the two single `a` characters inside `"aba"` yield just one distinct subsequence `"a"`.

Given a string `s` of lowercase letters, return the number of distinct non-empty subsequences, modulo `10^9 + 7`.

**Example 1:**
```
Input: s = "abc"
Output: 7
Explanation: Every non-empty pick of positions gives a fresh text: "a", "b", "c", "ab", "ac", "bc", "abc".
```

**Example 2:**
```
Input: s = "aba"
Output: 6
Explanation: The distinct texts are "a", "b", "ab", "aa", "ba" and "aba".
```

**Example 3:**
```
Input: s = "aaa"
Output: 3
Explanation: Only the length matters here: "a", "aa" and "aaa".
```

**Constraints:**
- `1 <= s.length <= 2000`
- `s` holds lowercase English letters.
