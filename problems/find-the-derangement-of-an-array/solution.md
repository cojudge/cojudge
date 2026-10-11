## Approach

Use the classic recurrence for derangements: with f[0]=1 and f[1]=0, each larger size satisfies f[i]=(i-1)*(f[i-1]+f[i-2]) because element 1 has i-1 destination choices and the displaced element either swaps back or joins a smaller derangement. Iterate upward keeping only the last two values under the modulus.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def findDerangement(self, n: int) -> int:
        MOD = 10 ** 9 + 7
        if n == 1:
            return 0
        a, b = 1, 0
        for i in range(2, n + 1):
            a, b = b, ((i - 1) * (a + b)) % MOD
        return b
```
