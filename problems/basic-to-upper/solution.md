## Approach

Visit each character and shift it by 32 positions when it falls in the lowercase range. Append every character, shifted or not, to the answer.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n).

## Implementation

```python
class Solution:
    def toUpper(self, s: str) -> str:
        out = []
        for c in s:
            if 'a' <= c <= 'z':
                out.append(chr(ord(c) - 32))
            else:
                out.append(c)
        return ''.join(out)
```
