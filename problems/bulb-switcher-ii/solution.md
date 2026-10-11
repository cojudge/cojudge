## Approach

The four operations interact so only a few states exist. With zero presses there is one pattern. A single lamp toggles between two states. Two lamps admit 3 states after one press and 4 afterwards. With three or more lamps the reachable counts are 4, 7, then 8 once at least three presses are available; extra presses only revisit states.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def flipLights(self, n: int, presses: int) -> int:
        if presses == 0:
            return 1
        if n == 1:
            return 2
        if n == 2:
            return 3 if presses == 1 else 4
        if presses == 1:
            return 4
        if presses == 2:
            return 7
        return 8
```
