## Approach

Keep two counters: the best wiggle ending with a rise and the best ending with a fall. A higher neighbor extends the falling best by one, a lower neighbor extends the rising best by one, and equal neighbors change nothing. The answer is the larger counter.

## Complexity Analysis

- **Time Complexity:** O(n), a single scan of `nums`.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List
class Solution:
    def wiggleMaxLength(self, nums: List[int]) -> int:
        if len(nums) < 2:
            return len(nums)
        up = down = 1
        for i in range(1, len(nums)):
            if nums[i] > nums[i - 1]:
                up = down + 1
            elif nums[i] < nums[i - 1]:
                down = up + 1
        return max(up, down)
```
