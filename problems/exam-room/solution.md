## Approach

Store taken seats in a sorted set. To seat, examine every gap: the leading edge offers seat 0 at distance first, each interior pair (a,b) offers midpoint (a+b)//2 at distance (b-a)//2, and the trailing edge offers N-1. Pick the largest distance, breaking ties by smaller index. Leaving just deletes from the set. The wrapper replays the operation log and collects seat answers.

## Complexity Analysis

- **Time Complexity:** O(k * m), where k is the seat call count and m the occupancy size, for gap scans.
- **Space Complexity:** O(m) for the ordered set.

## Implementation

```python
from typing import List
class Solution:
    def runExamRoom(self, operations: List[str], values: List[int]) -> List[int]:
        N = values[0]
        occ = []
        ans = []
        import bisect
        for op, v in zip(operations[1:], values[1:]):
            if op == 'seat':
                if not occ:
                    occ = [0]
                    ans.append(0)
                    continue
                best, best_d = -1, -1
                if occ[0] != 0:
                    best, best_d = 0, occ[0]
                for a, b in zip(occ, occ[1:]):
                    cand = (a + b) // 2
                    d = (b - a) // 2
                    if d > best_d:
                        best, best_d = cand, d
                if occ[-1] != N - 1:
                    d = N - 1 - occ[-1]
                    if d > best_d:
                        best, best_d = N - 1, d
                bisect.insort(occ, best)
                ans.append(best)
            elif op == 'leave':
                occ.remove(v)
        return ans
```
