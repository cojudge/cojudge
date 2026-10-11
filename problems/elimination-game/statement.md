Write the integers `1` through `n` in a row. Then repeatedly thin the row as follows: first sweep from left to right, deleting the first remaining value and then every second value after it; next sweep from right to left, deleting the last remaining value and then every second value before it. Keep alternating the sweep direction until a single value survives, and report it.

**Example 1:**
```
Input: n = 9
Output: 6
Explanation: Start with [1,2,3,4,5,6,7,8,9].
Left-to-right keeps [2,4,6,8]. Right-to-left keeps [2,6].
Left-to-right keeps [6]. The survivor is 6.
```

**Example 2:**
```
Input: n = 1
Output: 1
Explanation: A single entry is already the survivor.
```

**Example 3:**
```
Input: n = 4
Output: 2
Explanation: [1,2,3,4] -> keep [2,4] -> sweep from the right keeps [2].
```

**Constraints:**
- `1 <= n <= 10^9`

Simulating the deletions directly is far too slow for large `n`; track how the leading survivor and the step size evolve instead.
