## Approach

Keep, for every stone, the collection of hop sizes that can arrive there. The start stone holds hop size 0, and the second stone must be at distance 1 or the answer is immediately false. Each reachable state (stone, k) tries onward hops of k-1, k and k+1 to later stones recorded in a position map. The final stone is reachable exactly when its set is non-empty.

## Complexity Analysis

- **Time Complexity:** O(n^2) in the worst case, where n is the stone count.
- **Space Complexity:** O(n^2) for the stored hop sets in the worst case.

## Implementation

```python
from typing import List

class Solution:
    def canCross(self, stones: List[int]) -> bool:
        n = len(stones)
        if n <= 1:
            return True
        if stones[1] != 1:
            return False
        index_of = {x: i for i, x in enumerate(stones)}
        reach = [set() for _ in range(n)]
        reach[0].add(0)
        for i in range(n):
            for k in list(reach[i]):
                for nk in (k - 1, k, k + 1):
                    if nk <= 0:
                        continue
                    j = index_of.get(stones[i] + nk)
                    if j is not None:
                        reach[j].add(nk)
        return len(reach[n - 1]) > 0
```
