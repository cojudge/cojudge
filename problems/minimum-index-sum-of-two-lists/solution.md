## Approach

Map every name in the second list to its index, then scan the first list computing combined ranks for shared names. Keep the smallest rank seen and all names reaching it.

## Complexity Analysis

- **Time Complexity:** O(n+m).
- **Space Complexity:** O(m) for the index map.

## Implementation

```python
from typing import List
class Solution:
    def findRestaurant(self, list1: List[str], list2: List[str]) -> List[str]:
        pos = {w: i for i, w in enumerate(list2)}
        best = 10 ** 9
        ans = []
        for i, w in enumerate(list1):
            if w in pos:
                s = i + pos[w]
                if s < best:
                    best = s; ans = [w]
                elif s == best:
                    ans.append(w)
        return ans
```
