You consider all permutations of the numbers 1 through `n`. An inversion is a pair placed out of order (an earlier entry larger than a later one). Count how many permutations contain exactly `k` inversions, returning the count modulo 1000000007.

**Example 1:**
```
Input: n = 3, k = 0
Output: 1
Explanation: Only the sorted order has no inversions.
```

**Example 2:**
```
Input: n = 3, k = 1
Output: 2
```

**Example 3:**
```
Input: n = 2, k = 2
Output: 0
```

**Constraints:**
- `1 <= n <= 1000`
- `0 <= k <= 1000`
