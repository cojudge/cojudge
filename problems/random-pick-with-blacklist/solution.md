## Approach

Preprocess the blacklist once. Values below `sz = n - m` that are blocked are remapped to free tail values found by scanning down from `n - 1`. Each draw is wrapped into `[0, sz)` with a non-negative modulo and then translated through the map, giving a valid pick in O(1).

## Complexity Analysis

- **Time Complexity:** O(m + q), where m is the blacklist size and q the number of draws.
- **Space Complexity:** O(m) for the set and remap.

## Implementation

```python
from typing import List
class Solution:
    def runBlacklist(self, n: int, blacklist: List[int], calls: List[int]) -> List[int]:
        sz = n - len(blacklist)
        black = set(blacklist)
        mp = {}
        w = n - 1
        for b in blacklist:
            if b < sz:
                while w in black:
                    w -= 1
                mp[b] = w
                w -= 1
        ans = []
        for c in calls:
            t = c % sz
            ans.append(mp.get(t, t))
        return ans
```
