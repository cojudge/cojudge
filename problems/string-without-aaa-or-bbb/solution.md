## Approach

Greedily emit the currently more abundant letter. The only exception is when the last two emitted letters are equal: then the next letter is forced to be the other kind to avoid a triple. Because feasible inputs satisfy max <= 2*(min+1), the forced letter is always still available. Repeating this rule consumes all letters without ever creating aaa or bbb.

## Complexity Analysis

- **Time Complexity:** O(a + b) for emitting each character once.
- **Space Complexity:** O(a + b) for the output string.

## Implementation

```python
class Solution:
    def strWithout3a3b(self, a: int, b: int) -> str:
        res = []
        ca, cb = a, b
        while ca > 0 or cb > 0:
            if len(res) >= 2 and res[-1] == res[-2]:
                write_a = res[-1] == 'b'
            else:
                write_a = ca >= cb
            if write_a:
                if ca == 0:
                    res.append('b'); cb -= 1
                else:
                    res.append('a'); ca -= 1
            else:
                if cb == 0:
                    res.append('a'); ca -= 1
                else:
                    res.append('b'); cb -= 1
        return ''.join(res)
```
