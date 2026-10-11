## Approach

A run of k consecutive integers starting at x totals k*x + k*(k-1)/2, so for a fixed length k the value n - k*(k-1)/2 must be a positive multiple of k. Trying every length k with k*(k-1)/2 < n covers all feasible block sizes, and each passing k yields exactly one valid start. Counting those lengths gives the answer.

## Complexity Analysis

- **Time Complexity:** O(sqrt(n)) since k only ranges up to about sqrt(2n).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def consecutiveNumbersSum(self, n: int) -> int:
        ans = 0
        k = 1
        while k * (k - 1) // 2 < n:
            if (n - k * (k - 1) // 2) % k == 0:
                ans += 1
            k += 1
        return ans
```
