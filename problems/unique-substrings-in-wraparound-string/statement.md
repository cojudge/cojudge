Consider the endless wraparound string `"...zabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabc..."` formed by repeating the alphabet forever.

You are given a string `s`. Count how many distinct non-empty substrings of `s` also appear somewhere in that endless wraparound string. A substring is a block of consecutive characters of `s`.

**Example 1:**
```
Input: s = "a"
Output: 1
Explanation: The only substring "a" appears in the wraparound string.
```

**Example 2:**
```
Input: s = "cac"
Output: 2
Explanation: The distinct substrings present are "a" and "c"; "ca", "ac" and "cac" never occur consecutively in the wrap.
```

**Example 3:**
```
Input: s = "zab"
Output: 6
Explanation: Every substring of "zab" occurs in the wrap: "z", "a", "b", "za", "ab", "zab".
```

**Constraints:**
- `1 <= s.length <= 10^5`
- `s` consists of lowercase English letters.
