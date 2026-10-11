## Approach

Piles whose size is a multiple of 4 are losing: any move away from them lets the opponent restore a multiple of 4. Every other pile can move to a multiple of 4, so it is winning.

## Complexity Analysis

- **Time Complexity:** O(1)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def canWinNim(self, n: int) -> bool:
        return n % 4 != 0
```
