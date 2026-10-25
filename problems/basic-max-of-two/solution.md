## Approach

Compare the two values with an if statement. Return the first when it is greater than or equal to the second, otherwise return the second.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def maxOfTwo(self, a: int, b: int) -> int:
        if a >= b:
            return a
        return b
```
