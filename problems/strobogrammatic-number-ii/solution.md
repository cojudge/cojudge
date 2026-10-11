## Approach

Construct the numbers from the outside inward. The middle of an even length is the empty string, and the middle of an odd length is one of 0, 1, or 8. Each recursion level wraps every inner string with the five rotation pairs, skipping the 0-pair at the outermost level so no leading zero appears.

## Complexity Analysis

- **Time Complexity:** O(5^(n/2)), proportional to the number of generated strings times their length.
- **Space Complexity:** O(5^(n/2) * n) for the stored results.

## Implementation

```python
from typing import List

class Solution:
    def findStrobogrammatic(self, n: int) -> List[str]:
        def build(k: int, total: int) -> List[str]:
            if k == 0:
                return [""]
            if k == 1:
                return ["0", "1", "8"]
            inner = build(k - 2, total)
            res = []
            for s in inner:
                if k != total:
                    res.append("0" + s + "0")
                res.append("1" + s + "1")
                res.append("6" + s + "9")
                res.append("8" + s + "8")
                res.append("9" + s + "6")
            return res
        return build(n, n)
```
