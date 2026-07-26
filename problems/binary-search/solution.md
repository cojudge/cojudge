## Approach

Keep an inclusive interval containing every index where `target` could still appear. Compare the middle value with `target`, returning its index on equality and otherwise discarding the impossible half. If the interval becomes empty, the target is absent.

## Complexity Analysis

- **Time Complexity:** O(log n), where `n` is the length of `nums`.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List


class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            middle = left + (right - left) // 2
            if nums[middle] == target:
                return middle
            if nums[middle] < target:
                left = middle + 1
            else:
                right = middle - 1
        return -1
```
