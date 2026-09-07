## Approach

Binary-search the square root in `[1, x/2]` (for `x >= 2`). For a candidate
`mid`, compare `mid` with `x / mid` instead of `mid * mid` to avoid
overflow. When `mid <= x / mid`, `mid` is feasible and we try larger values;
otherwise we try smaller ones.

## Complexity Analysis

- **Time Complexity:** O(log x)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def mySqrt(self, x: int) -> int:
        if x < 2:
            return x
        left, right, ans = 1, x // 2, 1
        while left <= right:
            mid = left + (right - left) // 2
            if mid <= x // mid:
                ans = mid
                left = mid + 1
            else:
                right = mid - 1
        return ans
```
