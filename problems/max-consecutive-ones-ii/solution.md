## Approach

Expand a window to the right while counting zeroes inside it. Whenever a second zero appears, advance the left edge until only one zero remains. Because only the longest length is needed, the window effectively tracks the best stretch that flips at most one zero. All-ones input naturally yields the full length.

## Complexity Analysis

- **Time Complexity:** O(n), each index moves at most twice.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def findMaxConsecutiveOnes(self, nums: List[int]) -> int:
        best = 0
        left = 0
        zeros = 0
        for right, v in enumerate(nums):
            if v == 0:
                zeros += 1
            while zeros > 1:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            best = max(best, right - left + 1)
        return best
```
