## Approach

Picture the values as a tree where appending a digit moves to a child (`x` leads to `10*x` through `10*x + 9`). A depth-first walk of that tree visits values in dictionary order. Maintain one cursor: try to go deeper by multiplying by ten; when that would exceed `n`, step to the next sibling and strip trailing zeros by dividing, which climbs back up past finished branches. Each of the `n` steps emits exactly one number.

## Complexity Analysis

- **Time Complexity:** O(n), one constant-time step per emitted value.
- **Space Complexity:** O(1) extra besides the output list.

## Implementation

```python
from typing import List

class Solution:
    def lexicalOrder(self, n: int) -> List[int]:
        res = []
        cur = 1
        for _ in range(n):
            res.append(cur)
            if cur * 10 <= n:
                cur *= 10
            else:
                if cur >= n:
                    cur //= 10
                cur += 1
                while cur % 10 == 0:
                    cur //= 10
        return res
```
