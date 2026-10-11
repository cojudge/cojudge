## Approach

Count, for a candidate value `mid`, how many table entries are less than or equal to it. Row `i` contributes `min(n, mid / i)` such entries. This count rises monotonically with `mid`, so the desired answer is the smallest `mid` whose count reaches `k`, found with binary search over `[1, m*n]`.

## Complexity Analysis

- **Time Complexity:** O(min(m, mid) log(m*n)) for counting inside binary search; effectively O(m log(m*n)).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def findKthNumber(self, m: int, n: int, k: int) -> int:
        lo, hi = 1, m * n
        while lo < hi:
            mid = (lo + hi) // 2
            cnt = 0
            for i in range(1, min(m, mid) + 1):
                cnt += min(n, mid // i)
            if cnt >= k:
                hi = mid
            else:
                lo = mid + 1
        return lo
```
