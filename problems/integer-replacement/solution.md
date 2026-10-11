## Approach

Halve evens without choice. For an odd value, the two lowest bits decide: ending in `01` (or the special value 3) is best decreased so the result has more trailing zeros, while ending in `11` is best increased for the same reason. More trailing zeros mean more free halvings afterwards. Use a 64-bit variable so incrementing the maximum input does not overflow.

## Complexity Analysis

- **Time Complexity:** O(log n) steps.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def integerReplacement(self, n: int) -> int:
        x = n
        steps = 0
        while x != 1:
            if x % 2 == 0:
                x //= 2
            elif x == 3 or x % 4 == 1:
                x -= 1
            else:
                x += 1
            steps += 1
        return steps
```
