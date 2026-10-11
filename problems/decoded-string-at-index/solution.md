## Approach

Measure the finished tape length in one forward pass: letters add one, digits multiply the running total. Then walk the encoding backward while folding the position `k` modulo the current length. A digit shrinks the tracked length by division; a letter shrinks it by one — except when the folded position is 0 on a letter, which means the wanted character sits exactly at the end of that prefix, so it is returned.

## Complexity Analysis

- **Time Complexity:** O(|s|) for the two linear sweeps over the encoding.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
class Solution:
    def decodeAtIndex(self, s: str, k: int) -> str:
        size = 0
        for c in s:
            if c.isdigit():
                size *= int(c)
            else:
                size += 1
        for c in reversed(s):
            k %= size
            if k == 0 and c.isalpha():
                return c
            if c.isdigit():
                size //= int(c)
            else:
                size -= 1
        return ""
```
