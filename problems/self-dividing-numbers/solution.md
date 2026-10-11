## Approach

Iterate from `left` to `right` and keep the values whose digits all divide the value. Checking one value means peeling off decimal digits with modulo and division: a zero digit fails at once, and any digit that does not divide the original value fails too.

## Complexity Analysis

- **Time Complexity:** O((right - left + 1) * d), where d is the digit count (at most 5 here).
- **Space Complexity:** O(1) besides the answer list.

## Implementation

```python
from typing import List
class Solution:
    def selfDividingNumbers(self, left: int, right: int) -> List[int]:
        ans = []
        for x in range(left, right + 1):
            t = x
            good = True
            while t > 0:
                d = t % 10
                if d == 0 or x % d != 0:
                    good = False
                    break
                t //= 10
            if good:
                ans.append(x)
        return ans
```
