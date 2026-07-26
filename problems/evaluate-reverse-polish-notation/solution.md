## Approach

Push numeric tokens onto a stack. For an operator, pop the right operand and
then the left operand, apply the operation, and push the result. Division uses
absolute integer division followed by the correct sign so it truncates toward
zero without relying on floating-point arithmetic.

## Complexity Analysis

- **Time Complexity:** `O(t)` for `t` tokens.
- **Space Complexity:** `O(t)` in the worst case.

## Implementation

```python
from typing import List


class Solution:
    def evalRpn(self, tokens: List[str]) -> int:
        stack: List[int] = []
        for token in tokens:
            if token not in {"+", "-", "*", "/"}:
                stack.append(int(token))
                continue
            right = stack.pop()
            left = stack.pop()
            if token == "+":
                stack.append(left + right)
            elif token == "-":
                stack.append(left - right)
            elif token == "*":
                stack.append(left * right)
            else:
                quotient = abs(left) // abs(right)
                stack.append(-quotient if (left < 0) != (right < 0) else quotient)
        return stack[-1]
```
