## Approach

Use one stack for all pushed values and a second stack for active minimums.
Push a value onto the minimum stack when it is no greater than the current
minimum, including equal values so duplicate minima are removed correctly.
Collect results only for `top` and `getMin` operations.

## Complexity Analysis

- **Time Complexity:** `O(m)` for `m` operations, with `O(1)` work per operation.
- **Space Complexity:** `O(m)` in the worst case, excluding the returned answers.

## Implementation

```python
from typing import List


class Solution:
    def runMinStack(self, operations: List[str], values: List[int]) -> List[int]:
        stack: List[int] = []
        minimums: List[int] = []
        answers: List[int] = []
        for operation, value in zip(operations, values):
            if operation == "push":
                stack.append(value)
                if not minimums or value <= minimums[-1]:
                    minimums.append(value)
            elif operation == "pop":
                removed = stack.pop()
                if removed == minimums[-1]:
                    minimums.pop()
            elif operation == "top":
                answers.append(stack[-1])
            else:
                answers.append(minimums[-1])
        return answers
```
