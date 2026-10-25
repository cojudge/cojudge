## Approach

Start with the first value as the current best. Compare it against each of the other two values in turn, keeping the larger one.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def maxOfThree(self, a: int, b: int, c: int) -> int:
        best = a
        if b > best:
            best = b
        if c > best:
            best = c
        return best
```
