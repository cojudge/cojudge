## Approach

Count every value, then process distinct values from the smallest absolute value upward. Copies of `x` must be matched by the same number of copies of `2*x`, which is still untouched because its magnitude is larger. Zeros can only pair among themselves, so their count must be even. If every demand is met, the pairing exists.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting distinct keys.
- **Space Complexity:** O(n) for the frequency table.

## Implementation

```python
from typing import List
from collections import Counter
class Solution:
    def canReorderDoubled(self, arr: List[int]) -> bool:
        cnt = Counter(arr)
        for x in sorted(cnt, key=abs):
            c = cnt[x]
            if c == 0:
                continue
            if x == 0:
                if c % 2:
                    return False
                cnt[x] = 0
                continue
            if cnt.get(2 * x, 0) < c:
                return False
            cnt[2 * x] -= c
        return True
```
