Two strings of equal length are called scrambles of each other when one can be turned into the other by recursively splitting into two non-empty halves and optionally swapping the halves at any split. A single character only matches itself.

Given `s1` and `s2`, decide whether `s2` is a scrambled version of `s1`. Equal strings always qualify; strings with different character counts never do.

**Constraints:**
- `1 <= s1.length <= 30`
- `s1.length == s2.length`
- Both strings consist of lowercase English letters.
