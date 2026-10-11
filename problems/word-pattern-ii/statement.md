You are given a `pattern` string made of lowercase English letters and a text string `s`.
Decide whether `s` follows the pattern: every pattern letter must stand for one non-empty
block of characters, the same letter always stands for the same block, and two different
letters must stand for two different blocks. Concatenating the blocks in pattern order must
reproduce `s` exactly.

**Example 1:**
```
Input: pattern = "abab", s = "redblueredblue"
Output: true
Explanation: 'a' can mean "red" and 'b' can mean "blue", giving "red" + "blue" + "red" + "blue".
```

**Example 2:**
```
Input: pattern = "aaaa", s = "asdasdasdasd"
Output: true
Explanation: Every 'a' means "asd".
```

**Example 3:**
```
Input: pattern = "aabb", s = "xyzabcxzyabc"
Output: false
Explanation: No consistent assignment of blocks to 'a' and 'b' rebuilds the text.
```

**Constraints:**
- `1 <= pattern.length <= 20`
- `1 <= s.length <= 20`
- `pattern` and `s` contain only lowercase English letters.
