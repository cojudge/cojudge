## Approach

Sort the numbers so that order no longer matters for counting value-sets. In the sorted line-up, the element at position `i` serves as the biggest entry in precisely `2^i` subsequences (choose any subset of the `i` smaller items to join it) and as the tiniest entry in precisely `2^(n-1-i)` subsequences. Its net contribution is therefore `a[i] * (2^i - 2^(n-1-i))`. Adding those terms with powers of two prepared modulo `1_000_000_007` gives the wanted total.

## Complexity Analysis

- **Time Complexity:** O(n log n) for the sort plus O(n) for the sweep.
- **Space Complexity:** O(n) for the sorted copy and the power table (O(1) extra besides sorting if done in place).

## Implementation

```python
from typing import List
class Solution:
    def sumSubseqWidths(self, nums: List[int]) -> int:
        MOD = 10 ** 9 + 7
        a = sorted(nums)
        n = len(a)
        pw = [1] * n
        for i in range(1, n):
            pw[i] = (pw[i - 1] * 2) % MOD
        ans = 0
        for i, v in enumerate(a):
            ans = (ans + v * (pw[i] - pw[n - 1 - i])) % MOD
        return ans % MOD
```
