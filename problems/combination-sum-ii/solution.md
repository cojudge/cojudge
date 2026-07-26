## Approach

Sort the candidates and backtrack from left to right, advancing to `i + 1` after each choice so every input position is used at most once. At each recursion depth, skip equal values after the first to prevent duplicate combinations, and stop when the next value exceeds the remaining target.

## Complexity Analysis

- **Time Complexity:** O(n log n + S + R * L), where `S` is the number of visited backtracking states, `R` is the number of returned combinations, and `L` is their maximum length; `S` is at most O(2^n).
- **Space Complexity:** O(n + R * L) for the recursion path, sorted candidates, and output.

## Implementation

```python
from typing import List


class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates = sorted(candidates)
        result: List[List[int]] = []
        current: List[int] = []

        def search(start: int, remaining: int) -> None:
            if remaining == 0:
                result.append(current[:])
                return
            for i in range(start, len(candidates)):
                if i > start and candidates[i] == candidates[i - 1]:
                    continue
                value = candidates[i]
                if value > remaining:
                    break
                current.append(value)
                search(i + 1, remaining - value)
                current.pop()

        search(0, target)
        return result
```
