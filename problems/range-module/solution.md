## Approach

Keep disjoint half-open intervals ordered by start in a balanced tree. Adding widens the new span across every overlapped neighbor and inserts once. Querying checks only the interval starting at or before `left`. Removing trims overlapped intervals and possibly splits one survivor into two. Only queries append to the answer list.

## Complexity Analysis

- **Time Complexity:** O(m log k) over m calls with k disjoint intervals.
- **Space Complexity:** O(k).

## Implementation

```python
from typing import List
import bisect
class Solution:
    def runRangeModule(self, operations: List[str], args: List[List[int]]) -> List[int]:
        ivs: list[list[int]] = []
        ans = []
        for op, a in zip(operations, args):
            if op == "RangeModule":
                continue
            l, r = a[0], a[1]
            if op == "addRange":
                nl, nr = l, r
                nxt = []
                for s, e in ivs:
                    if e < l or s > r:
                        nxt.append([s, e])
                    else:
                        nl = min(nl, s); nr = max(nr, e)
                nxt.append([nl, nr])
                nxt.sort()
                ivs = nxt
            elif op == "removeRange":
                nxt = []
                for s, e in ivs:
                    if e <= l or s >= r:
                        nxt.append([s, e])
                    else:
                        if s < l:
                            nxt.append([s, l])
                        if e > r:
                            nxt.append([r, e])
                ivs = nxt
            elif op == "queryRange":
                ok = any(s <= l and e >= r for s, e in ivs)
                ans.append(1 if ok else 0)
        return ans
```
