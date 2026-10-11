## Approach

Scan the choice text from right to left while keeping a stack. Plain values and colons are pushed. When a question mark is seen, pop the true branch, discard the colon, pop the false branch, and push back whichever branch the condition character selects. Because nesting groups from the right, this single pass collapses every level.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `expression`. Each character is pushed and popped at most once.
- **Space Complexity:** O(n) for the stack in the worst case.

## Implementation

```python
class Solution:
    def parseTernary(self, expression: str) -> str:
        st = []
        i = len(expression) - 1
        while i >= 0:
            c = expression[i]
            if c == '?':
                cond = expression[i - 1]
                i -= 1
                t = st.pop()
                st.pop()
                f = st.pop()
                st.append(t if cond == 'T' else f)
            elif c == ':':
                st.append(c)
            else:
                st.append(c)
            i -= 1
        return st.pop()
```
