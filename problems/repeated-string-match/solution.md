## Approach

Grow a buffer by appending `a` until it is at least as long as `b`. If `b` already occurs, return the repeat count. Otherwise append one more copy — any longer repetition would only repeat the same alignments — and test again; failure means `-1`.

## Complexity Analysis

- **Time Complexity:** O((|b|/|a| + 2) * (|a| + |b|)) for building and searching.
- **Space Complexity:** O(|b| + |a|) for the buffer.

## Implementation

```python
class Solution:
    def repeatedStringMatch(self, a: str, b: str) -> int:
        buf = ""
        count = 0
        while len(buf) < len(b):
            buf += a
            count += 1
        if b in buf:
            return count
        buf += a
        count += 1
        if b in buf:
            return count
        return -1
```
