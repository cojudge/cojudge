## Approach

Return tiny strings directly. For longer strings recurse on everything after the first character, then append that first character at the end.

## Complexity Analysis

- **Time Complexity:** O(n^2).
- **Space Complexity:** O(n^2).

## Implementation

```python
class Solution:
    def reverseTextRec(self, s: str) -> str:
        if len(s) <= 1:
            return s
        return self.reverseTextRec(s[1:]) + s[0]
```
