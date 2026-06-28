## Approach

Use a stack to match brackets: push opening brackets onto the stack, and when a closing bracket appears, check that it matches the top of the stack.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

## Implementation

```python
class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {')': '(', ']': '[', '}': '{'}
        stack = []
        for c in s:
            if c in pairs:
                if not stack or stack.pop() != pairs[c]:
                    return False
            else:
                stack.append(c)
        return not stack
```
