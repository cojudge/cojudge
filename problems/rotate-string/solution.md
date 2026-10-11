## Approach

Different lengths are rejected at once. Otherwise every rotation of `s` is a contiguous block of the doubled string `s + s`, so the task reduces to a single substring test for `goal`.

## Complexity Analysis

- **Time Complexity:** O(n^2) in the worst case with naive search, O(n) with an efficient matcher, where n is the string length.
- **Space Complexity:** O(n) for the doubled string.

## Implementation

```python
class Solution:
    def rotateString(self, s: str, goal: str) -> bool:
        if len(s) != len(goal):
            return False
        return goal in (s + s)
```
