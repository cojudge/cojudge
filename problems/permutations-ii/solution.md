## Approach

Sort the array first so that equal values are adjacent. Perform standard permutation backtracking, but skip a value at a given recursion depth when it equals the previous value and that previous value has not been used yet in the current branch. This rule ensures that duplicate elements are not placed at the same position across branches, so each unique permutation is produced exactly once.

## Complexity Analysis

- **Time Complexity:** O(n * P) where P is the number of unique permutations of length n; each permutation is copied at a cost of O(n).
- **Space Complexity:** O(n) for the recursion stack and helper data, excluding the O(n * P) output.

## Implementation

```python
from typing import List


class Solution:
    def permuteUnique(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        n = len(nums)
        result: List[List[int]] = []
        used = [False] * n
        current: List[int] = []

        def backtrack() -> None:
            if len(current) == n:
                result.append(current.copy())
                return
            for i in range(n):
                if used[i]:
                    continue
                if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                    continue
                used[i] = True
                current.append(nums[i])
                backtrack()
                current.pop()
                used[i] = False

        backtrack()
        return result
```