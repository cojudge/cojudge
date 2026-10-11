## Approach

Build a table where each cell extends the diagonal match by one when the two current values agree and resets to zero otherwise. The table entry therefore equals the length of the longest shared suffix ending at those positions, and the largest entry overall is the longest shared block.

## Complexity Analysis

- **Time Complexity:** O(m*n), where m and n are the array lengths.
- **Space Complexity:** O(m*n), reducible to O(n) with one rolling row.

## Implementation

```python
from typing import List
class Solution:
    def findLength(self, nums1: List[int], nums2: List[int]) -> int:
        m, n = len(nums1), len(nums2)
        dp = [0]*(n+1)
        best = 0
        for i in range(1, m+1):
            ndp = [0]*(n+1)
            for j in range(1, n+1):
                if nums1[i-1] == nums2[j-1]:
                    ndp[j] = dp[j-1] + 1
                    best = max(best, ndp[j])
            dp = ndp
        return best
```
