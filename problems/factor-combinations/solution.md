## Approach

Build factor rows depth-first. At each step only try divisors from the last chosen factor upward, which keeps every row non-decreasing and avoids duplicate orderings. When a divisor splits the remainder, the current path plus the quotient forms one valid row, and the search continues on the quotient to find longer rows.

## Complexity Analysis

- **Time Complexity:** O(n^(1/2) branching) in practice; bounded by the number of divisor chains of `n`.
- **Space Complexity:** O(log n) recursion depth plus the output.

## Implementation

```python
from typing import List

class Solution:
    def getFactors(self, n: int) -> List[List[int]]:
        res: List[List[int]] = []
        def search(remaining: int, start: int, cur: List[int]) -> None:
            f = start
            while f * f <= remaining:
                if remaining % f == 0:
                    cur.append(f)
                    res.append(cur + [remaining // f])
                    search(remaining // f, f, cur)
                    cur.pop()
                f += 1
        search(n, 2, [])
        return res
```
