## Approach

Walk the index graph with a global visited set. From each fresh start, follow `nums[k]` links until hitting visited ground, counting steps; every index is claimed once, so the whole procedure is linear. The longest such walk equals the longest cycle, which is the required maximum chain length.

## Complexity Analysis

- **Time Complexity:** O(n), each index visited at most once.
- **Space Complexity:** O(n) for the visited flags.

## Implementation

```python
from typing import List

class Solution:
    def arrayNesting(self, nums: List[int]) -> int:
        seen = [False] * len(nums)
        best = 0
        for i in range(len(nums)):
            if seen[i]:
                continue
            cur, ln = i, 0
            while not seen[cur]:
                seen[cur] = True
                cur = nums[cur]
                ln += 1
            best = max(best, ln)
        return best
```
