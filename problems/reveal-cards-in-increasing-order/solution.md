## Approach

Sort the cards increasingly, then decide where each one starts. Simulate the reveal routine on a queue of free positions: the front position receives the next smallest card (it is revealed next), and the following front position rotates to the back (mirroring the move-to-bottom step). Filling positions this way yields a deck that reveals in sorted order.

## Complexity Analysis

- **Time Complexity:** O(n log n), dominated by sorting.
- **Space Complexity:** O(n) for the queue and the answer.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def deckRevealedIncreasing(self, deck: List[int]) -> List[int]:
        n = len(deck)
        ans = [0] * n
        q = deque(range(n))
        for card in sorted(deck):
            ans[q.popleft()] = card
            if q:
                q.append(q.popleft())
        return ans
```
