Two strings of equal length are called scrambles of each other when one can be turned into the other by recursively splitting into two non-empty halves and optionally swapping the halves at any split. A single character only matches itself.

Given `s1` and `s2`, decide whether `s2` is a scrambled version of `s1`. Equal strings always qualify; strings with different character counts never do.

**Example 1:**
```
Input: s1 = "great", s2 = "rgeat"
Output: true
Explanation: Split into gr/eat, swap the first half to rg, then rejoin as rgeat.
```

**Example 2:**
```
Input: s1 = "abcde", s2 = "caebd"
Output: false
Explanation: No sequence of recursive swaps turns abcde into caebd.
```

**Example 3:**
```
Input: s1 = "a", s2 = "a"
Output: true
Explanation: Identical single characters match.
```

**Constraints:**
- `1 <= s1.length <= 30`
- `s1.length == s2.length`
- Both strings consist of lowercase English letters.
