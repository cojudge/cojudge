## Approach

Sort the input so duplicate values are adjacent, then use backtracking to enumerate subsets. Every recursion state contributes the current subset. At a given recursion depth, skip a value when it is equal to the previous candidate so the same subset is not generated twice.

## Complexity Analysis

- **Time Complexity:** O(n log n + n * S), where `S` is the number of distinct subsets and copying each subset costs up to O(n).
- **Space Complexity:** O(n) auxiliary recursion and path space, excluding the O(n * S) output.

## Implementation

```python
from typing import List


class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        nums = sorted(nums)
        result: List[List[int]] = []
        current: List[int] = []

        def backtrack(start: int) -> None:
            result.append(current.copy())
            for i in range(start, len(nums)):
                if i > start and nums[i] == nums[i - 1]:
                    continue
                current.append(nums[i])
                backtrack(i + 1)
                current.pop()

        backtrack(0)
        return result
```
