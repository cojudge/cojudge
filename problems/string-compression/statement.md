You are given text `s` made of letters. Imagine squeezing each maximal block of equal letters: keep one copy of the letter, and if the block length is greater than one, write the block length right after it. For example `aaab` squeezes to `a3b`.

Return the length of the squeezed form. You do not need to build the squeezed text itself, only report how long it would be.

> **Adaptation note:** the classic task rewrites a character array in place and returns its new length. Here the input arrives as a `string` `s` and you return the squeezed length as an `int`, using the same counting rule. A block of length `1` adds `1`, a block of length `c > 1` adds `1 + digits(c)`.

**Example 1:**
```
Input: s = "aabbccc"
Output: 6
Explanation: Blocks aa, bb and ccc become a2, b2 and c3, giving a2b2c3 of length 6.
```

**Example 2:**
```
Input: s = "a"
Output: 1
Explanation: A single letter stays as a.
```

**Example 3:**
```
Input: s = "abbbbbbbbbbbb"
Output: 4
Explanation: The b block has length 11, so the squeezed form is ab11 of length 4.
```

**Constraints:**
- `1 <= s.length <= 2000`
- `s` contains only English letters.
