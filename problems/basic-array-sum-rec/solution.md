## Approach

Recurse over the array index: past-the-end returns zero, otherwise add the current element to the recursive sum of the suffix.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n).

## Implementation

```python
from typing import List

class Solution:
    def arraySumRec(self, nums: List[int]) -> int:
        if not nums:
            return 0
        return nums[0] + self.arraySumRec(nums[1:])
```
