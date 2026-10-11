## Approach

Enumerate every pair of left/right column borders and collapse the strip into
row sums, reducing the 2D task to a 1D bounded-subarray task. Scanning prefix
sums while storing them in a sorted set lets each position find the smallest
earlier prefix that keeps the subarray sum at or below k.

## Complexity Analysis

- **Time Complexity:** O(n^2 * m log m) for an m x n matrix.
- **Space Complexity:** O(m) for the strip sums and the prefix set.

## Implementation

```python
import bisect
from typing import List

class Solution:
    def maxSumSubmatrix(self, matrix: List[List[int]], k: int) -> int:
        m, n = len(matrix), len(matrix[0])
        best = float("-inf")
        for l in range(n):
            sums = [0] * m
            for r in range(l, n):
                for i in range(m):
                    sums[i] += matrix[i][r]
                cur = 0
                seen = [0]
                for x in sums:
                    cur += x
                    j = bisect.bisect_left(seen, cur - k)
                    if j < len(seen):
                        best = max(best, cur - seen[j])
                        if best == k:
                            return k
                    bisect.insort(seen, cur)
        return best
```
