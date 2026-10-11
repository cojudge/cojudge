## Approach

Walk the array once while remembering seen values in a boolean table sized `n+1`, which is possible because every entry lies in `1..n`. The first time a value appears mark it seen; the second time append it to the answer and mark it reported so it is emitted once.

## Complexity Analysis

- **Time Complexity:** O(n), one pass over `nums`.
- **Space Complexity:** O(n) for the seen and reported tables.

## Implementation

```python
from typing import List
class Solution:
    def findDuplicates(self, nums: List[int]) -> List[int]:
        seen = [False] * (len(nums) + 1)
        added = [False] * (len(nums) + 1)
        res = []
        for x in nums:
            if 1 <= x <= len(nums):
                if seen[x] and not added[x]:
                    res.append(x)
                    added[x] = True
                seen[x] = True
        return res
```
