You are given a binary string `s` containing only `'0'` and `'1'`. In one move you may flip any single character (`'0'` to `'1'` or `'1'` to `'0'`).

A string is monotone increasing when it consists of some number of `'0'`s followed by some number of `'1'`s (either part may be empty). Return the smallest number of flips needed to make `s` monotone increasing.

**Example 1:**
```
Input: s = "00110"
Output: 1
Explanation: Flipping the last '0' to '1' gives "00111".
```

**Example 2:**
```
Input: s = "010110"
Output: 2
Explanation: Flipping to "000111" or "011111" both take two moves.
```

**Example 3:**
```
Input: s = "00011000"
Output: 2
Explanation: Flipping the two '1's to '0' leaves all zeros.
```

**Constraints:**
- `1 <= s.length <= 100000`
- `s` contains only `'0'` and `'1'`.
