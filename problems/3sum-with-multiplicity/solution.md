## Approach

Because values are confined to 0..100, tally frequencies once and iterate over value triples `i <= j <= k` summing to the target. Each triple contributes the product of available picks, using combinations (nC2, nC3) when values coincide, all reduced modulo 1,000,000,007.

## Complexity Analysis

- **Time Complexity:** O(n + V^2) with V = 101 distinct values.
- **Space Complexity:** O(V) for the frequency table.

## Implementation

```python
from typing import List
class Solution:
    def threeSumMulti(self, arr: List[int], target: int) -> int:
        mod = 10 ** 9 + 7
        c = [0] * 101
        for v in arr:
            c[v] += 1
        ans = 0
        for i in range(101):
            if c[i] == 0:
                continue
            for j in range(i, 101):
                if c[j] == 0:
                    continue
                k = target - i - j
                if k < j or k > 100 or c[k] == 0:
                    continue
                if i == j == k:
                    ans += c[i] * (c[i] - 1) * (c[i] - 2) // 6
                elif i == j:
                    ans += c[i] * (c[i] - 1) // 2 * c[k]
                elif j == k:
                    ans += c[i] * c[j] * (c[j] - 1) // 2
                else:
                    ans += c[i] * c[j] * c[k]
        return ans % mod
```
