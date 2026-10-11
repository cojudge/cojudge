You may only add characters to the front of a string `s`. Determine the shortest palindrome that can be produced this way and return it.

In other words, find the smallest prefix to prepend so the whole result reads the same forwards and backwards.

**Example 1:**
```
Input: s = "aacecaaa"
Output: "aaacecaaa"
Explanation: The longest palindromic prefix is "aacecaa" (length 7); mirroring the leftover "a" in front yields the palindrome "aaacecaaa".
```

**Example 2:**
```
Input: s = "abcd"
Output: "dcbabcd"
Explanation: No prefix longer than "a" is a palindrome, so "dcb" is prepended.
```

**Example 3:**
```
Input: s = "aba"
Output: "aba"
Explanation: The string is already a palindrome, so nothing is added.
```

**Constraints:**
- `0 <= s.length <= 5 * 10^4`
- `s` consists of lowercase English letters.
