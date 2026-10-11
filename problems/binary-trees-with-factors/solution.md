## Approach

Sort the array so that when a value is processed, all of its potential factors are already solved. Keep dp[v] as the number of trees rooted at v, starting at 1 for the singleton. For each pair of earlier values whose product equals the current root, multiply their tree counts and add the ordered contribution (iterating over all left factors automatically counts both orders). Sum all dp entries modulo 1e9+7.

## Complexity Analysis

- **Time Complexity:** O(n^2) for n values, one divisibility check per pair.
- **Space Complexity:** O(n) for the DP table and index map.

## Implementation

```python
from typing import List
class Solution:
    def numFactoredBinaryTrees(self, arr: List[int]) -> int:
        MOD = 10 ** 9 + 7
        arr = sorted(arr)
        pos = {v: i for i, v in enumerate(arr)}
        dp = [1] * len(arr)
        for i, root in enumerate(arr):
            for j in range(i):
                if root % arr[j] != 0:
                    continue
                other = root // arr[j]
                k = pos.get(other)
                if k is not None:
                    dp[i] = (dp[i] + dp[j] * dp[k]) % MOD
        return sum(dp) % MOD
```
