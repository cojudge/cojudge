## Approach

Use backtracking to make an exclude-or-include choice for each input value. Once every position has been considered, copy the current path into the result; uniqueness of the input values guarantees unique subsets.

## Complexity Analysis

- **Time Complexity:** O(n * 2^n), accounting for copying all `2^n` subsets.
- **Space Complexity:** O(n * 2^n) for the result and O(n) auxiliary recursion space.

## Implementation

```python
from typing import List


class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        result: List[List[int]] = []
        current: List[int] = []

        def search(index: int) -> None:
            if index == len(nums):
                result.append(current[:])
                return
            search(index + 1)
            current.append(nums[index])
            search(index + 1)
            current.pop()

        search(0)
        return result
```
