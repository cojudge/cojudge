You are given two strings `s1` and `s2`. Find the shortest contiguous block of `s1` that contains `s2` as a subsequence — meaning the characters of `s2` appear in order inside the block, possibly with other characters in between.

If several blocks share the same minimal length, return the one that starts earliest. When no block of `s1` contains `s2` as a subsequence, return the empty string.

**Constraints:**
- `1 <= s1.length <= 20000`
- `1 <= s2.length <= 100`
- Both strings hold lowercase English letters.
