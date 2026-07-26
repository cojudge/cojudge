## Approach

Count every rank and visit distinct ranks in sorted order. If the smallest rank with remaining copies occurs `k` times, all `k` copies must begin groups because no smaller card remains to precede them. Consume `k` copies from that rank and each of the next `groupSize - 1` ranks; a missing count proves that no valid grouping exists.

## Complexity Analysis

- **Time Complexity:** O(n + u log u), where `u` is the number of distinct ranks.
- **Space Complexity:** O(u) for the rank counts and sorted distinct ranks.

## Implementation

```python
from collections import Counter
from typing import List


class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        if len(hand) % groupSize != 0:
            return False

        counts = Counter(hand)
        for first in sorted(counts):
            copies = counts[first]
            if copies == 0:
                continue
            for card in range(first, first + groupSize):
                if counts[card] < copies:
                    return False
                counts[card] -= copies
        return True
```
