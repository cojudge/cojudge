## Approach

Backtrack through valid prefixes while counting opened and closed parentheses.
An opening parenthesis can be added while fewer than `n` are used, and a
closing parenthesis can be added only when fewer have been closed than opened.
This generates every valid string without generating invalid candidates.

## Complexity Analysis

- **Time Complexity:** `O(C_n * n)`, where `C_n` is the nth Catalan number.
- **Space Complexity:** `O(n)` for recursion and the current string, excluding the `O(C_n * n)` output.

## Implementation

```python
from typing import List


class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        result: List[str] = []

        def build(opened: int, closed: int, current: List[str]) -> None:
            if len(current) == n * 2:
                result.append("".join(current))
                return
            if opened < n:
                current.append("(")
                build(opened + 1, closed, current)
                current.pop()
            if closed < opened:
                current.append(")")
                build(opened, closed + 1, current)
                current.pop()

        build(0, 0, [])
        return result
```
