## Approach

Sort the candidates so a branch can stop as soon as the next value exceeds the remaining target. Backtrack with a nondecreasing start index, and recurse from the same index after a choice so that each candidate may be reused without generating permutations of one combination.

## Complexity Analysis

- **Time Complexity:** O(n log n + S + R * L), where `S` is the number of backtracking states, `R` is the number of returned combinations, and `L` is their maximum length.
- **Space Complexity:** O(n + L + R * L) for the sorted candidates, recursion path, and output.

## Implementation

```python
from typing import List


class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates = sorted(candidates)
        result: List[List[int]] = []
        current: List[int] = []

        def search(start: int, remaining: int) -> None:
            if remaining == 0:
                result.append(current[:])
                return
            for i in range(start, len(candidates)):
                value = candidates[i]
                if value > remaining:
                    break
                current.append(value)
                search(i, remaining - value)
                current.pop()

        search(0, target)
        return result
```
