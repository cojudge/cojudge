## Approach

Maintain two arrays: `len[i]` is the length of the longest increasing subsequence ending at `i`, and `cnt[i]` counts how many such runs end there. For each `i`, scan earlier positions `j` with `nums[j] < nums[i]`; adopt a longer length with its count, or accumulate counts on ties. Sum counts where the length equals the global best.

## Complexity Analysis

- **Time Complexity:** O(n^2) pairwise comparisons.
- **Space Complexity:** O(n) for the two tables.

## Implementation

```python
from typing import List
class Solution:
    def findNumberOfLIS(self, nums: List[int]) -> int:
        n = len(nums)
        if n == 0:
            return 0
        lens = [1] * n
        cnts = [1] * n
        for i in range(n):
            for j in range(i):
                if nums[j] < nums[i]:
                    if lens[j] + 1 > lens[i]:
                        lens[i] = lens[j] + 1
                        cnts[i] = cnts[j]
                    elif lens[j] + 1 == lens[i]:
                        cnts[i] += cnts[j]
        best = max(lens)
        return sum(c for l, c in zip(lens, cnts) if l == best)
```
