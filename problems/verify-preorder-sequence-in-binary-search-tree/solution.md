## Approach

Scan the sequence while remembering the smallest value the next entry is allowed to take. Maintain a stack of ancestors: when the current value exceeds the stack top, pop ancestors and raise the lower bound to the last popped value, which models moving into a right subtree. If any value arrives at or below the bound, the order is impossible.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `preorder`. Each value is pushed and popped at most once.
- **Space Complexity:** O(n) for the stack in the worst case.

## Implementation

```python
from typing import List

class Solution:
    def verifyPreorder(self, preorder: List[int]) -> bool:
        stack: List[int] = []
        low = float("-inf")
        for v in preorder:
            if v <= low:
                return False
            while stack and v > stack[-1]:
                low = stack.pop()
            stack.append(v)
        return True
```
