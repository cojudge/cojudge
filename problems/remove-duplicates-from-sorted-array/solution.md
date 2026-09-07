## Approach

Because the array is sorted, duplicates are adjacent. Keep a slow pointer `k` for the position of the next unique element. Scan with a fast pointer `i`; whenever `nums[i]` differs from `nums[k-1]`, copy it to `nums[k]` and increment `k`. Return `k`.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the array. Each element is visited once.
- **Space Complexity:** O(1). Only two pointers are used.

## Implementation

```python
from typing import List
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        if not nums:
            return 0
        k = 1
        for i in range(1, len(nums)):
            if nums[i] != nums[k - 1]:
                nums[k] = nums[i]
                k += 1
        return k
```
