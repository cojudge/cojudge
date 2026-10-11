## Approach

Backtrack over the digits 1 to 9, always extending the current pick with a larger digit so every combination is built in increasing order exactly once. Cut a branch when the running sum already exceeds `n` or when fewer digits remain than needed. When the pick holds `k` digits summing to `n`, store a copy of it.

## Complexity Analysis

- **Time Complexity:** O(C(9, k)), bounded by the number of k-subsets of nine digits.
- **Space Complexity:** O(k) for the recursion stack plus the output.

## Implementation

```python
from typing import List

class Solution:
    def combinationSum3(self, k: int, n: int) -> List[List[int]]:
        res: List[List[int]] = []

        def build(start: int, total: int, cur: List[int]) -> None:
            if len(cur) == k:
                if total == n:
                    res.append(list(cur))
                return
            for d in range(start, 10):
                if total + d > n:
                    break
                cur.append(d)
                build(d + 1, total + d, cur)
                cur.pop()

        build(1, 0, [])
        return res
```
