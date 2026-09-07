## Approach

Backtracking. Build a combination one element at a time. At each step the next chosen value must be strictly greater than the last one chosen, which guarantees each combination is generated exactly once and in increasing order. Start the search from 1 and only consider candidates up to the point where enough values remain to fill the combination (`n - remaining + 1`). When `current` has size `k`, record a copy of it. Removing the last element after exploring a branch undoes the choice (backtracking).

## Complexity Analysis

- **Time Complexity:** O(C(n, k) * k) — there are `n choose k` combinations, each costing O(k) to copy.
- **Space Complexity:** O(k) for the recursion stack and current list, excluding the O(C(n, k) * k) output.

## Implementation

```python
from typing import List


class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        result: List[List[int]] = []
        current: List[int] = []

        def backtrack(start: int) -> None:
            if len(current) == k:
                result.append(current.copy())
                return
            remaining = k - len(current)
            for i in range(start, n - remaining + 2):
                current.append(i)
                backtrack(i + 1)
                current.pop()

        backtrack(1)
        return result
```