## Approach

Scan the cards once and mark every value that appears on both faces of the same card as forbidden: such a card exposes that value no matter how it is flipped. Then scan all front and back faces and keep the smallest value not in the forbidden set. When everything is forbidden, return 0.

## Complexity Analysis

- **Time Complexity:** O(n) for n cards.
- **Space Complexity:** O(n) for the forbidden set in the worst case.

## Implementation

```python
from typing import List
class Solution:
    def flipgame(self, fronts: List[int], backs: List[int]) -> int:
        bad = {f for f, b in zip(fronts, backs) if f == b}
        ans = 10 ** 9
        for v in fronts + backs:
            if v not in bad and v < ans:
                ans = v
        return 0 if ans == 10 ** 9 else ans
```
