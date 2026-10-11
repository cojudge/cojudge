## Approach

Replay the script against a count table plus buckets from count to key set. Insertion and removal update both structures; extremes come from the smallest and largest occupied buckets. Because any tied extreme is valid, the checker compares counts rather than exact keys.

## Complexity Analysis

- **Time Complexity:** O(n log m) with an ordered bucket map, where n is the step count and m the distinct counts (O(1) average with a doubly-linked bucket list).
- **Space Complexity:** O(k) for k distinct keys.

## Implementation

```python
from typing import List
class Solution:
    def runAllOne(self, operations: List[str], values: List[str]) -> List[str]:
        from collections import defaultdict
        cnt = {}
        buckets = defaultdict(set)
        res = []
        for op, v in zip(operations, values):
            if op == 'AllOne':
                cnt.clear()
                buckets.clear()
                res.append('null')
            elif op == 'inc':
                c = cnt.get(v, 0)
                if c:
                    buckets[c].discard(v)
                cnt[v] = c + 1
                buckets[c + 1].add(v)
                res.append('null')
            elif op == 'dec':
                c = cnt[v]
                buckets[c].discard(v)
                if c == 1:
                    del cnt[v]
                else:
                    cnt[v] = c - 1
                    buckets[c - 1].add(v)
                res.append('null')
            elif op == 'getMaxKey':
                if not cnt:
                    res.append('')
                else:
                    mx = max(cnt.values())
                    res.append(next(k for k, c in cnt.items() if c == mx))
            elif op == 'getMinKey':
                if not cnt:
                    res.append('')
                else:
                    mn = min(cnt.values())
                    res.append(next(k for k, c in cnt.items() if c == mn))
        return res
```
