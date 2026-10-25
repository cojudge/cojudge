## Approach

Trim surrounding spaces and return zero when nothing remains. Otherwise split on runs of whitespace and count the pieces.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n).

## Implementation

```python
class Solution:
    def countWords(self, s: str) -> int:
        parts = s.split()
        return len(parts)
```
