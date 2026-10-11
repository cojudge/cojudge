## Approach

Model the stack with a plain list. Push appends; pop and top touch the end. Both max queries scan for the largest value, and `popMax` deletes its topmost occurrence via a reverse search. Only the four read/remove actions append to the answer list.

## Complexity Analysis

- **Time Complexity:** O(m*n) worst case over m calls on depth n due to max scans; easily fast for test sizes.
- **Space Complexity:** O(n) for the stack plus answers.

## Implementation

```python
from typing import List
class Solution:
    def runMaxStack(self, operations: List[str], values: List[int]) -> List[int]:
        st: list[int] = []
        ans: list[int] = []
        for op, v in zip(operations, values):
            if op == "push":
                st.append(v)
            elif op == "pop":
                ans.append(st.pop())
            elif op == "top":
                ans.append(st[-1])
            elif op == "peekMax":
                ans.append(max(st))
            elif op == "popMax":
                mx = max(st)
                idx = len(st) - 1 - st[::-1].index(mx)
                st.pop(idx)
                ans.append(mx)
        return ans
```
