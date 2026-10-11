Starting from a positive integer `n`, you may apply these moves: when the current value is even, halve it; when it is odd, either increment or decrement it by one. Count the fewest moves that reduce `n` to `1`.

The choice on odd values matters: sometimes going up first beats going down first, and the best local move depends on the lower bits.

**Example 1:**
```
Input: n = 8
Output: 3
Explanation: 8 -> 4 -> 2 -> 1 uses three halvings.
```

**Example 2:**
```
Input: n = 7
Output: 4
Explanation: 7 -> 8 -> 4 -> 2 -> 1 beats 7 -> 6 -> 3 -> 2 -> 1.
```

**Example 3:**
```
Input: n = 4
Output: 2
Explanation: 4 -> 2 -> 1.
```

**Constraints:**
- `1 <= n <= 2^31 - 1`

Care is needed near the upper bound, where incrementing temporarily exceeds 32-bit range.
