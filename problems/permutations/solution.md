## Approach

Build each permutation from left to right with backtracking. Track which input positions are already used, append each available value, and undo the choice after exploring that branch. When the current permutation contains every value, append a copy to the result.

## Complexity Analysis

- **Time Complexity:** O(n * n!), including copying all `n!` permutations of length `n`.
- **Space Complexity:** O(n) auxiliary space for the recursion, current permutation, and used flags, excluding the O(n * n!) output.

## Implementation

```python
from typing import List


class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        result: List[List[int]] = []
        used = [False] * len(nums)
        current: List[int] = []

        def backtrack() -> None:
            if len(current) == len(nums):
                result.append(current.copy())
                return
            for i, value in enumerate(nums):
                if used[i]:
                    continue
                used[i] = True
                current.append(value)
                backtrack()
                current.pop()
                used[i] = False

        backtrack()
        return result
```
