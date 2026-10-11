## Approach

Simulate the stack directly. Push the input values in order, and after every push pop the top while it equals the next value demanded by the pop order. If the whole pop order is consumed, the sequence is feasible; leftover demand means some value was buried and the answer is false.

## Complexity Analysis

- **Time Complexity:** O(n), each value is pushed and popped at most once.
- **Space Complexity:** O(n) for the simulation stack.

## Implementation

```python
from typing import List
class Solution:
    def validateStackSequences(self, pushed: List[int], popped: List[int]) -> bool:
        st = []
        j = 0
        for x in pushed:
            st.append(x)
            while st and j < len(popped) and st[-1] == popped[j]:
                st.pop()
                j += 1
        return j == len(popped)
```
