## Approach

Depth-first search over every split of the digit string. Keep the evaluated total plus the last operand so a following * can undo the last addition/subtraction and apply the product, preserving precedence. Prune chunks with leading zeros.

## Complexity Analysis

- **Time Complexity:** O(4^n) in the worst case (three operators per gap).
- **Space Complexity:** O(n) recursion depth plus output storage.

## Implementation

```python
from typing import List
class Solution:
    def addOperators(self, num: str, target: int) -> List[str]:
        res: List[str] = []
        def dfs(pos: int, value: int, last: int, expr: str) -> None:
            if pos == len(num):
                if value == target:
                    res.append(expr)
                return
            for i in range(pos, len(num)):
                if i != pos and num[pos] == '0':
                    break
                cur = int(num[pos:i + 1])
                if pos == 0:
                    dfs(i + 1, cur, cur, num[pos:i + 1])
                else:
                    dfs(i + 1, value + cur, cur, expr + "+" + num[pos:i + 1])
                    dfs(i + 1, value - cur, -cur, expr + "-" + num[pos:i + 1])
                    dfs(i + 1, value - last + last * cur, last * cur, expr + "*" + num[pos:i + 1])
        dfs(0, 0, 0, "")
        return res
```
