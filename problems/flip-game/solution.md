## Approach

Slide a window of width two across the board; whenever both cells show '+', emit a copy with that pair flipped to '-'.

## Complexity Analysis

- **Time Complexity:** O(n^2)
- **Space Complexity:** O(n)

## Implementation

```python
from typing import List
class Solution:
    def generatePossibleNextMoves(self, currentState: str) -> List[str]:
        res = []
        for i in range(len(currentState) - 1):
            if currentState[i] == '+' and currentState[i + 1] == '+':
                res.append(currentState[:i] + '--' + currentState[i + 2:])
        return res
```
