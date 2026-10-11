You start with one `A` on screen and four operations: type one more `A`, copy everything shown, paste the clipboard, or select everything (select must precede a useful copy). With exactly `n` key presses, how many `A` characters can be on screen at most?

Implement `maxA(n)` returning that maximum.

**Example 1:**
```
Input: n = 3
Output: 3
Explanation: Type three times.
```

**Example 2:**
```
Input: n = 7
Output: 9
Explanation: Type, type, type, select, copy, paste, paste: 3 -> 6 -> 9.
```

**Example 3:**
```
Input: n = 1
Output: 1
```

**Constraints:**
- `1 <= n <= 50`
