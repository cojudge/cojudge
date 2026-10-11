Consider an `m` by `n` grid where the cell in row `i` and column `j` (both counting from 1) stores the product `i * j`.

Imagine writing all `m * n` products in nondecreasing order. Return the `k`-th entry in that order (`k` counts from 1).

**Example 1:**
```
Input: m = 3, n = 3, k = 5
Output: 3
Explanation: The nine products are 1,2,3,2,4,6,3,6,9. Ordered they become 1,2,2,3,3,4,6,6,9 and the 5th is 3.
```

**Example 2:**
```
Input: m = 2, n = 3, k = 6
Output: 6
Explanation: The products are 1,2,3,2,4,6. The largest (6th smallest) is 6.
```

**Example 3:**
```
Input: m = 1, n = 1, k = 1
Output: 1
```

**Constraints:**
- `1 <= m, n <= 30000`
- `1 <= k <= m * n`
