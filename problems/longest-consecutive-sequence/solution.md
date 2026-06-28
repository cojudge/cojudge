## Approach
Place all numbers in a set, then iterate through them. For each number, only start counting a consecutive sequence if it is the smallest element of that sequence (i.e., `x - 1` is not in the set). Expand upward from that starting point and track the maximum length found.

## Complexity Analysis
- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

## Implementation
```python
from typing import List
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        s = set(nums)
        res = 0
        for x in s:
            if x - 1 not in s:
                y = x + 1
                while y in s:
                    y += 1
                res = max(res, y - x)
        return res
```
