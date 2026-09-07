## Approach

Keep a stack of the currently valid scores. Scan `operations` once: an integer string is parsed and pushed, `"C"` pops the last score, `"D"` pushes twice the last score, and `"+"` pushes the sum of the last two scores (pop the top briefly to peek the second value, then restore it). Finally sum every value left in the stack.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of operations. Each operation does O(1) stack work.
- **Space Complexity:** O(n) for the stack of valid scores.

## Implementation

```python
from typing import List

class Solution:
    def calPoints(self, operations: List[str]) -> int:
        stack: List[int] = []
        for op in operations:
            if op == "C":
                stack.pop()
            elif op == "D":
                stack.append(2 * stack[-1])
            elif op == "+":
                stack.append(stack[-1] + stack[-2])
            else:
                stack.append(int(op))
        return sum(stack)
```
