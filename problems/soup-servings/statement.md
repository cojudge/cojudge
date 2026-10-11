Two large pots hold `n` millilitres of soup A and soup B. In each turn, one of four serving pairs is chosen with equal chance: (100,0), (75,25), (50,50), or (25,75), where the first number is taken from A and the second from B. If less than the chosen amount remains, the pot is simply emptied.

The process stops as soon as at least one pot becomes empty. We want the chance that A empties first, counting the case where both empty together as half a success.

Return that probability as a decimal string (for example `"0.625"`). Answers within a tiny tolerance are accepted.

**Example 1:**
```
Input: n = 50
Output: "0.625"
Explanation: Five sixteenths of paths empty together, contributing half weight.
```

**Example 2:**
```
Input: n = 100
Output: "0.71875"
Explanation: A larger start favours A emptying first.
```

**Example 3:**
```
Input: n = 0
Output: "0.5"
Explanation: Both pots start empty, counted as half.
```

**Constraints:**
- `0 <= n <= 10^9`
- This is a portable adaptation: the floating answer is exchanged as a decimal string with tolerance 1e-9 absolute plus 1e-5 relative.
