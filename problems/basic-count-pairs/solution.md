## Approach

Nest two loops so every unordered index pair is visited exactly once. Test each pair's sum against the target and count the matches.

## Complexity Analysis

- **Time Complexity:** O(n^2).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def countPairs(self, nums: List[int], target: int) -> int:
        count = 0
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    count += 1
        return count
```
