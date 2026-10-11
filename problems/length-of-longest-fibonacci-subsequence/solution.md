## Approach

Build a map from each array value to its index. Then treat every pair of positions `(i, j)` as the tail of a candidate run: the element that must come right before them is `arr[j] - arr[i]`. When that value exists earlier in the array at index `k`, the run extends the best run ending at `(k, i)` by one; otherwise the pair starts a fresh run of length 2. The answer is the largest table entry, or 0 when nothing reaches length 3.

## Complexity Analysis

- **Time Complexity:** O(n^2), where n is the length of `arr`. Each pair is processed once with O(1) map lookups.
- **Space Complexity:** O(n^2) for the pair-length table plus O(n) for the index map.

## Implementation

```python
from typing import List

class Solution:
    def lenLongestFibSubseq(self, arr: List[int]) -> int:
        idx = {v: i for i, v in enumerate(arr)}
        n = len(arr)
        dp = [[0] * n for _ in range(n)]
        best = 0
        for j in range(n):
            for i in range(j):
                k = idx.get(arr[j] - arr[i])
                if k is not None and k < i:
                    dp[i][j] = dp[k][i] + 1
                else:
                    dp[i][j] = 2
                best = max(best, dp[i][j])
        return best if best >= 3 else 0
```
