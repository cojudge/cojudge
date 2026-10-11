## Approach

Try every operator as the last one evaluated: split the expression at that position, recursively compute all values of the left and right parts, and pair every left value with every right value through the operator. A segment without operators contributes its plain numeric value. Order of results does not matter.

## Complexity Analysis

- **Time Complexity:** Exponential in the number of operators (Catalan growth), each split combining both sides.
- **Space Complexity:** O(n) recursion depth plus the stored partial results.

## Implementation

```python
from typing import List

class Solution:
    def diffWaysToCompute(self, expression: str) -> List[int]:
        res = []
        for i, c in enumerate(expression):
            if c in "+-*":
                for a in self.diffWaysToCompute(expression[:i]):
                    for b in self.diffWaysToCompute(expression[i + 1:]):
                        if c == "+":
                            res.append(a + b)
                        elif c == "-":
                            res.append(a - b)
                        else:
                            res.append(a * b)
        if not res:
            res.append(int(expression))
        return res
```
