## Approach

Repeated digit sums settle into a cycle of length 9. Zero stays zero, and every positive number reduces to 1 plus the remainder of the number minus 1 divided by 9. This computes the digit root directly without simulating each round.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def addDigits(self, num: int) -> int:
        if num == 0:
            return 0
        return 1 + (num - 1) % 9
```
