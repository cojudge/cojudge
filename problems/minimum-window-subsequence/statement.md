You are given two strings `s1` and `s2`. Find the shortest contiguous block of `s1` that contains `s2` as a subsequence — meaning the characters of `s2` appear in order inside the block, possibly with other characters in between.

If several blocks share the same minimal length, return the one that starts earliest. When no block of `s1` contains `s2` as a subsequence, return the empty string.

**Example 1:**
```
Input: s1 = "abcdebdde", s2 = "bde"
Output: "bcde"
Explanation: The block s1[1..4] holds b, then c, then d, then e, and no shorter block works.
```

**Example 2:**
```
Input: s1 = "abc", s2 = "ac"
Output: "abc"
Explanation: Only the whole string contains a before c.
```

**Example 3:**
```
Input: s1 = "abc", s2 = "d"
Output: ""
Explanation: The letter d never appears, so no block qualifies.
```

**Constraints:**
- `1 <= s1.length <= 20000`
- `1 <= s2.length <= 100`
- Both strings hold lowercase English letters.
