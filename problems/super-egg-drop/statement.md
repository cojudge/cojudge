You have `k` identical eggs and a tower with `n` floors. An egg dropped from floor `f` either breaks (then the critical floor is below `f`) or survives (then it is at or above `f`). Find the smallest number of drops that guarantees locating the critical floor in the worst case, no matter where it is.

Return that minimum number of drops.

**Example 1:**
```
Input: k = 1, n = 2
Output: 2
Explanation: With one egg there is no room for risk, so both floors must be tried from the bottom up.
```

**Example 2:**
```
Input: k = 2, n = 6
Output: 3
Explanation: Three drops always suffice (for instance, first try floor 3), and two drops cannot cover 6 floors.
```

**Example 3:**
```
Input: k = 3, n = 14
Output: 4
Explanation: Four drops cover up to 4 + 6 + 4 = 14 floors with three eggs, and three drops fall short.
```

**Constraints:**
- `1 <= k <= 100`
- `1 <= n <= 10^4`
