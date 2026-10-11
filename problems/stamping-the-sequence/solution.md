## Approach

Work backwards from `target` to all question marks. A window can be erased when it matches the stamp except for already erased cells and contains at least one unerased cell. Repeatedly erase such windows, recording each position; if no window applies before everything is erased, the task is impossible. Reversing the recorded order gives a forward build.

## Complexity Analysis

- **Time Complexity:** O(n * (n - m)) in the worst case, with n the target length and m the stamp length. Each pass scans all windows.
- **Space Complexity:** O(n) for the mutable copy and bookkeeping.

## Implementation

```python
from typing import List
class Solution:
    def movesToStamp(self, stamp: str, target: str) -> List[int]:
        m, n = len(stamp), len(target)
        if m > n:
            return []
        t = list(target)
        res = []
        vis = [False] * n
        stars = 0
        while stars < n:
            changed = False
            for i in range(n - m + 1):
                if vis[i]:
                    continue
                match = 0
                ok = True
                for k in range(m):
                    if t[i + k] == '?':
                        continue
                    if t[i + k] != stamp[k]:
                        ok = False
                        break
                    match += 1
                if not ok or match == 0:
                    continue
                vis[i] = True
                changed = True
                res.append(i)
                for k in range(m):
                    if t[i + k] != '?':
                        t[i + k] = '?'
                        stars += 1
                if stars == n:
                    break
            if not changed:
                return []
        res.reverse()
        return res
```
