## Approach

Check the remainder of dividing by two. A remainder of zero means the number is even, which directly gives the boolean answer.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def isEven(self, n: int) -> bool:
        return n % 2 == 0
```
