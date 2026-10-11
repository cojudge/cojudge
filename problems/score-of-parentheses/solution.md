## Approach

Walk through the brackets while keeping a running total for each open level on a stack. Opening a bracket starts a fresh level with value zero. Closing a bracket finishes the inner total `v`: a bare pair contributes one, otherwise it contributes twice the inner total, and that amount is added to the enclosing level.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`. Each character is pushed and popped once.
- **Space Complexity:** O(n) for the stack in the worst case of deep nesting.

## Implementation

```python
class Solution:
    def scoreOfParentheses(self, s: str) -> int:
        st = [0]
        for c in s:
            if c == '(':
                st.append(0)
            else:
                v = st.pop()
                st[-1] += max(2 * v, 1)
        return st[0]
```
