## Approach

Use a sliding window with `left` and `right` pointers and a running `sum`. Expand `right` to include new elements; whenever `sum >= target`, record the window length and shrink `left` to try a shorter valid window. Track the minimum length seen.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`. Each element enters and leaves the window once.
- **Space Complexity:** O(1). Only pointers and a running sum are used.

## Implementation

```python
from typing import List
class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        best = float("inf")
        left = 0
        s = 0
        for right, v in enumerate(nums):
            s += v
            while s >= target:
                best = min(best, right - left + 1)
                s -= nums[left]
                left += 1
        return 0 if best == float("inf") else best
```
