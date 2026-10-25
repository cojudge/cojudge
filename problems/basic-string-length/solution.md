## Approach

Walk through the string one character at a time with a counter. The final count equals the number of characters.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def strLength(self, s: str) -> int:
        count = 0
        for _ in s:
            count += 1
        return count
```
