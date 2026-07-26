## Approach

Place one pointer at each end of the sorted array. If their sum is too small,
move the left pointer right; if it is too large, move the right pointer left.
Return the required 1-based indices when the unique target pair is found.

## Complexity Analysis

- **Time Complexity:** `O(n)`.
- **Space Complexity:** `O(1)` excluding the returned array.

## Implementation

```python
from typing import List


class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        left, right = 0, len(numbers) - 1
        while left < right:
            total = numbers[left] + numbers[right]
            if total == target:
                return [left + 1, right + 1]
            if total < target:
                left += 1
            else:
                right -= 1
        return []
```
