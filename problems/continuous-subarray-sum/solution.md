## Approach

Walk the array while maintaining the running total. For a nonzero `k`, only the remainder of the running total modulo `k` matters: whenever the same remainder has been seen at least two positions earlier, the slice in between sums to a multiple of `k`. Storing each remainder's earliest index in a hash map finds such a slice in one pass. When `k` is zero there is no remainder to compute, so the same idea is applied to the raw running totals (a repeat means a zero-sum slice).

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`. Each element is processed once.
- **Space Complexity:** O(n) in the worst case for the remainder map.

## Implementation

```python
from typing import List
class Solution:
    def checkSubarraySum(self, nums: List[int], k: int) -> bool:
        first = {0: -1}
        total = 0
        for i, v in enumerate(nums):
            total += v
            key = total if k == 0 else total % k
            if key in first:
                if i - first[key] >= 2:
                    return True
            else:
                first[key] = i
        return False
```
