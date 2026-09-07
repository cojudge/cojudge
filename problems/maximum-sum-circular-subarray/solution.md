## Approach

Use Kadane's algorithm in one pass to find the maximum subarray sum of the straight array and, in the same pass, the minimum subarray sum. The best circular subarray is either the straight maximum (case 1) or the total sum minus the minimum subarray (case 2, where the subarray wraps around). When every element is negative, the straight maximum is already the answer.

## Complexity Analysis

- **Time Complexity:** O(n), where `n` is `nums.length`.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        total = 0
        max_end = 0
        max_sum = float("-inf")
        min_end = 0
        min_sum = float("inf")

        for x in nums:
            total += x
            max_end = max(x, max_end + x)
            max_sum = max(max_sum, max_end)
            min_end = min(x, min_end + x)
            min_sum = min(min_sum, min_end)

        if max_sum < 0:
            return max_sum
        return max(max_sum, total - min_sum)
```