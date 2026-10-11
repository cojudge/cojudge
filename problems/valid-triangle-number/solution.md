## Approach

Sort the array so each triple can be judged by its two smaller sides versus the largest. Lock the largest index and sweep the two smaller pointers inward: if their sum clears the largest, then every element between the left pointer and the right pointer also clears it, so a whole batch is counted and the right pointer steps down; otherwise the left pointer steps up. Repeating for every largest position visits each triple class once.

## Complexity Analysis

- **Time Complexity:** O(n^2), dominated by the two-pointer sweep per largest index after an O(n log n) sort.
- **Space Complexity:** O(1) besides the sort workspace.

## Implementation

```python
from typing import List
class Solution:
    def triangleNumber(self, nums: List[int]) -> int:
        nums.sort()
        n = len(nums)
        count = 0
        for k in range(2, n):
            i, j = 0, k - 1
            while i < j:
                if nums[i] + nums[j] > nums[k]:
                    count += j - i
                    j -= 1
                else:
                    i += 1
        return count
```
