## Approach

Start from an empty builder and append a copy of the string once per iteration for k iterations.

## Complexity Analysis

- **Time Complexity:** O(n*k).
- **Space Complexity:** O(n*k).

## Implementation

```python
class Solution:
    def repeatString(self, s: str, k: int) -> str:
        return s * k
```
