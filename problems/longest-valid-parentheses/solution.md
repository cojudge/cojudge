## Approach

Keep a stack of indices with -1 as the initial base. Push each opening bracket's index; on a closing bracket, pop and, when the stack still holds something, update the best length using the distance from the current index to the new top. If the stack empties, the current index becomes the new base because no valid block can cross it.

## Complexity Analysis

- **Time Complexity:** O(n), a single left-to-right scan.
- **Space Complexity:** O(n) for the stack in the worst case.

## Implementation

```python
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        best = 0
        stack = [-1]
        for i, c in enumerate(s):
            if c == '(':
                stack.append(i)
            else:
                stack.pop()
                if not stack:
                    stack.append(i)
                else:
                    best = max(best, i - stack[-1])
        return best
```
