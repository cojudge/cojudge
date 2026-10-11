## Approach

Scan left to right with a stack of open tag names. CDATA jumps to its terminator, closers must match the stack top, openers push, and plain text is legal only inside some tag. When the stack empties the scan must be exactly at the end, which enforces a single outer element.

## Complexity Analysis

- **Time Complexity:** O(n^2) worst case with naive search, O(n) with an index scan.
- **Space Complexity:** O(n) for the stack.

## Implementation

```python
class Solution:
    def isValid(self, code: str) -> bool:
        n = len(code)
        st = []
        i = 0
        def good(t):
            return 1 <= len(t) <= 9 and all('A' <= c <= 'Z' for c in t)
        while i < n:
            if code.startswith('<![CDATA[', i):
                j = code.find(']]>', i + 9)
                if j < 0 or not st:
                    return False
                i = j + 3
            elif code.startswith('</', i):
                j = code.find('>', i)
                if j < 0:
                    return False
                tag = code[i+2:j]
                if not good(tag) or not st or st.pop() != tag:
                    return False
                i = j + 1
                if not st and i != n:
                    return False
            elif code[i] == '<':
                j = code.find('>', i)
                if j < 0:
                    return False
                tag = code[i+1:j]
                if not good(tag):
                    return False
                st.append(tag)
                i = j + 1
            else:
                if not st:
                    return False
                i += 1
        return not st
```
