## Approach

Sort a copy of the array, then scan neighbouring pairs and keep the largest difference. Fewer than two elements yields zero. Sorting dominates the cost and keeps the logic simple and correct.

## Complexity Analysis

- **Time Complexity:** O(n log n) from sorting, plus O(n) for the scan.
- **Space Complexity:** O(n) for the sorted copy (O(1) extra if sorting in place).

## Implementation

```python
from typing import List
class Solution:
    def maximumGap(self, nums: List[int]) -> int:
        if len(nums) < 2:
            return 0
        nums = sorted(nums)
        best = 0
        for i in range(1, len(nums)):
            best = max(best, nums[i] - nums[i - 1])
        return best
```
