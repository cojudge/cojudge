## Approach

Loop from the final index down to zero, appending each visited character to a builder. The builder then holds the reversed text.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n).

## Implementation

```python
class Solution:
    def reverseText(self, s: str) -> str:
        return s[::-1]
```
