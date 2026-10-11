## Approach

View the values as a ten-way tree: the children of `x` are `x*10` through `x*10+9`. Dictionary order is a depth-first walk of this tree. Instead of walking one by one, count how many entries live under a prefix with a helper that sums interval sizes across levels. If the whole subtree fits before `k`, skip it sideways; otherwise go deeper to the first child. Repeat until `k` is consumed.

## Complexity Analysis

- **Time Complexity:** O(log n) jumps, each counting across O(log n) levels.
- **Space Complexity:** O(1) extra memory.

## Implementation

```python
class Solution:
    def findKthNumber(self, n: int, k: int) -> int:
        def steps(p1: int, p2: int) -> int:
            s = 0
            while p1 <= n:
                s += min(n + 1, p2) - p1
                p1 *= 10
                p2 *= 10
            return s
        cur = 1
        k -= 1
        while k > 0:
            c = steps(cur, cur + 1)
            if c <= k:
                cur += 1
                k -= c
            else:
                cur *= 10
                k -= 1
        return cur
```
