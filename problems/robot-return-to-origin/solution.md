## Approach

Keep a horizontal and a vertical counter. Each letter moves one counter up or down by one. After all steps the robot is home exactly when both counters are zero.

## Complexity Analysis

- **Time Complexity:** O(n) over the move string.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def judgeCircle(self, moves: str) -> bool:
        x = y = 0
        for c in moves:
            if c == 'U':
                y += 1
            elif c == 'D':
                y -= 1
            elif c == 'L':
                x -= 1
            elif c == 'R':
                x += 1
        return x == 0 and y == 0
```
