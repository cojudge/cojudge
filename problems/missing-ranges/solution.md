## Approach

Place a virtual guard just below `lower` and another just above `upper`, then scan the array in order. The gap between each pair of consecutive covered values tells what is missing: a gap of exactly one yields a single number, while a wider gap yields a start->end range. Using wider integer arithmetic avoids overflow at the bounds.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`.
- **Space Complexity:** O(1) besides the output list.

## Implementation

```python
from typing import List
class Solution:
    def findMissingRanges(self, nums: List[int], lower: int, upper: int) -> List[str]:
        res = []
        prev = lower - 1
        for i in range(len(nums) + 1):
            cur = nums[i] if i < len(nums) else upper + 1
            if cur - prev >= 2:
                a, b = prev + 1, cur - 1
                if a == b:
                    res.append(str(a))
                else:
                    res.append(f"{a}->{b}")
            prev = cur
        return res
```
