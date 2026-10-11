## Approach

Replay each string left to right with a builder: letters append, while `#` removes the last kept letter when one exists. The two reduced texts are then compared directly for equality.

## Complexity Analysis

- **Time Complexity:** O(n + m), where n and m are the input lengths.
- **Space Complexity:** O(n + m) for the two builders (a two-pointer variant reaches O(1)).

## Implementation

```python
class Solution:
    def backspaceCompare(self, s: str, t: str) -> bool:
        def build(x):
            buf = []
            for c in x:
                if c == '#':
                    if buf:
                        buf.pop()
                else:
                    buf.append(c)
            return ''.join(buf)
        return build(s) == build(t)
```
