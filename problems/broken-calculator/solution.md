## Approach

Reason backwards from `target` toward `startValue`. In reverse, doubling
becomes halving and subtracting becomes adding one. While `target` stays above
`startValue`, an even target is halved for free progress, while an odd target
must first be incremented (one operation) to become even. Each reverse step
maps to exactly one forward operation. Once `target` sinks to `startValue` or
below, only plain subtractions remain, contributing `startValue - target`
operations.

## Complexity Analysis

- **Time Complexity:** O(log target), since target at least halves every two steps.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def brokenCalc(self, startValue: int, target: int) -> int:
        ops = 0
        while target > startValue:
            ops += 1
            if target % 2 == 1:
                target += 1
            else:
                target //= 2
        return ops + (startValue - target)
```
