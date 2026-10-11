## Approach

Count the chain once to learn its length `n`. Every group receives `n / k` values, and the first `n % k` groups receive one additional value. Walk the chain a second time, cutting each group off by nulling the tail link. Positions beyond the values stay empty.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of values. Two linear passes cover counting and cutting.
- **Space Complexity:** O(k) for the array of group heads, besides the output chains themselves.

## Implementation

```python
from typing import List, Optional
class Solution:
    def splitListToParts(self, head, k: int):
        n = 0
        p = head
        while p:
            n += 1
            p = p.next
        base, extra = divmod(n, k)
        ans = []
        cur = head
        for i in range(k):
            size = base + (1 if i < extra else 0)
            ans.append(cur)
            for _ in range(size - 1 if size else 0):
                cur = cur.next
            if cur:
                nxt = cur.next
                cur.next = None
                cur = nxt
        return ans
```
