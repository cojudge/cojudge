## Approach

Simulate the process in reverse. While both target coordinates stay at or
above the start, the larger one must have been produced by adding the
smaller one some number of times, so subtract a whole batch at once with a
remainder operation. When one axis already equals its start value, the other
axis only needs a divisibility check. If a remainder becomes zero or a
coordinate drops below its start value, the target is unreachable.

## Complexity Analysis

- **Time Complexity:** O(log(min(tx, ty))) due to the remainder-style shrinking.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def reachingPoints(self, sx: int, sy: int, tx: int, ty: int) -> bool:
        while tx >= sx and ty >= sy:
            if tx == sx and ty == sy:
                return True
            if tx == sx:
                return (ty - sy) % tx == 0
            if ty == sy:
                return (tx - sx) % ty == 0
            if tx > ty:
                tx %= ty
            else:
                ty %= tx
        return False
```
