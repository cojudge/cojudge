## Approach

Enumerate strobogrammatic strings for each length from `len(low)` through `len(high)` using the outside-in construction. A candidate is kept when it is not below `low` (for the shortest length) and not above `high` (for the longest length); middle lengths always qualify. Same-length numeric comparison reduces to lexicographic string comparison.

## Complexity Analysis

- **Time Complexity:** O(5^(m/2) * m), where m is the length of `high`, for generating and filtering candidates.
- **Space Complexity:** O(5^(m/2) * m) for the generated strings.

## Implementation

```python
from typing import List

class Solution:
    def strobogrammaticInRange(self, low: str, high: str) -> int:
        def build(n: int, total: int) -> List[str]:
            if n == 0:
                return [""]
            if n == 1:
                return ["0", "1", "8"]
            res = []
            for s in build(n - 2, total):
                if n != total:
                    res.append("0" + s + "0")
                res.append("1" + s + "1")
                res.append("6" + s + "9")
                res.append("8" + s + "8")
                res.append("9" + s + "6")
            return res

        count = 0
        for length in range(len(low), len(high) + 1):
            for s in build(length, length):
                if len(s) == len(low) and s < low:
                    continue
                if len(s) == len(high) and s > high:
                    continue
                count += 1
        return count
```
