## Approach

For every position count how many array entries equal its value with an inner loop. Track the largest such count across all positions.

## Complexity Analysis

- **Time Complexity:** O(n^2).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def maxFrequency(self, nums: List[int]) -> int:
        return max(nums.count(x) for x in nums)
```
