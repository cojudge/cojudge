## Approach

Sort the array, then fix two indices `i` and `j` and use two pointers `l` and `r` for the remaining pair. When the four sum equals the target, record the quadruplet and skip duplicates. Skipping duplicates at every level guarantees unique quadruplets, and the output order does not matter.

## Complexity Analysis

- **Time Complexity:** O(n³), where n is the length of the array. Sorting is O(n log n) and the triple nested sweep dominates.
- **Space Complexity:** O(1) extra besides the output (O(n) for sorting depending on the implementation).

## Implementation

```python
from typing import List
class Solution:
    def fourSum(self, nums: List[int], target: int) -> List[List[int]]:
        nums.sort()
        n = len(nums)
        res = []
        for i in range(n - 3):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            for j in range(i + 1, n - 2):
                if j > i + 1 and nums[j] == nums[j - 1]:
                    continue
                l, r = j + 1, n - 1
                while l < r:
                    s = nums[i] + nums[j] + nums[l] + nums[r]
                    if s == target:
                        res.append([nums[i], nums[j], nums[l], nums[r]])
                        lv, rv = nums[l], nums[r]
                        while l < r and nums[l] == lv:
                            l += 1
                        while l < r and nums[r] == rv:
                            r -= 1
                    elif s < target:
                        l += 1
                    else:
                        r -= 1
        return res
```
