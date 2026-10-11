You start with one `A` on screen and two operations: copy everything currently shown, and paste the clipboard's contents to the end. The clipboard starts empty; a copy overwrites it, and a paste does not change it.

Implement `minSteps(n)` returning the fewest operations that leave exactly `n` characters on screen.

**Example 1:**
```
Input: n = 3
Output: 3
Explanation: Copy (1) then paste twice: 1 -> 2 -> 3.
```

**Example 2:**
```
Input: n = 1
Output: 0
Explanation: The single A is already there.
```

**Example 3:**
```
Input: n = 6
Output: 5
Explanation: Copy, paste to 2, copy, paste to 4, paste to 6.
```

**Constraints:**
- `1 <= n <= 1000`
