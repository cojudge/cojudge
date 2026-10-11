## Approach

Add up the first window of length k, then slide the window across the array by adding each newcomer and subtracting the element that falls out. The largest window sum seen, divided once by k, is the maximum average, formatted as a decimal string.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length. Each element enters and leaves the window once.
- **Space Complexity:** O(1) beyond the input.

## Implementation

```python
from typing import List

class Solution:
    def findMaxAverage(self, nums: List[int], k: int) -> str:
        cur = sum(nums[:k])
        best = cur
        for i in range(k, len(nums)):
            cur += nums[i] - nums[i - k]
            best = max(best, cur)
        return str(best / k)
```
