## Approach

Each senator's optimal move is to ban the closest opposite-party senator appearing later in the voting order. Keep two queues holding the indices of the Radiant and Dire senators still holding rights. In each round compare the heads: the earlier senator bans the later one (removing it) and re-queues at its own position plus `n` to re-enter future rounds. The party whose queue empties first loses.

## Complexity Analysis

- **Time Complexity:** O(n), where `n` is `senate.length`.
- **Space Complexity:** O(n) for the two queues.

## Implementation

```python
from collections import deque

class Solution:
    def predictPartyVictory(self, senate: str) -> str:
        n = len(senate)
        radiant = deque(i for i, ch in enumerate(senate) if ch == "R")
        dire = deque(i for i, ch in enumerate(senate) if ch == "D")

        while radiant and dire:
            r = radiant.popleft()
            d = dire.popleft()
            if r < d:
                radiant.append(r + n)
            else:
                dire.append(d + n)
        return "Radiant" if radiant else "Dire"
```