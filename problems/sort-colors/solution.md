## Approach

Use the Dutch national flag algorithm with three pointers `low`, `mid`, and `high`. Scan with `mid`: on `0` swap to `low` and advance both; on `1` advance `mid`; on `2` swap to `high` and shrink `high`. This sorts 0s, 1s, 2s in a single pass without a library sort.

## Complexity Analysis

- **Time Complexity:** O(n), single pass over `nums`.
- **Space Complexity:** O(1) extra (O(n) for the returned copy in this judge's functional form; in-place otherwise).

## Implementation

```python
from typing import List
class Solution:
    def sortColors(self, nums: List[int]) -> List[int]:
        low = mid = 0
        high = len(nums) - 1
        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1
        return nums
```
