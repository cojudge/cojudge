## Approach

Sort-and-count with merge sort handles the quadratic bottleneck. After recursively sorting both halves, the right half is in order, so a single moving pointer counts for each left element how many right elements satisfy `left > 2*right`. A standard merge then keeps the segment sorted for upper levels. All doubling uses Python integers (unbounded) so overflow is impossible.

## Complexity Analysis

- **Time Complexity:** O(n log n) for the divide-and-conquer counting and merging.
- **Space Complexity:** O(n) for the temporary merge buffer.

## Implementation

```python
from typing import List

class Solution:
    def reversePairs(self, nums: List[int]) -> int:
        a = list(nums)

        def sort_count(l: int, r: int) -> int:
            if l >= r:
                return 0
            m = (l + r) // 2
            cnt = sort_count(l, m) + sort_count(m + 1, r)
            j = m + 1
            for i in range(l, m + 1):
                while j <= r and a[i] > 2 * a[j]:
                    j += 1
                cnt += j - (m + 1)
            tmp = []
            i, k = l, m + 1
            while i <= m and k <= r:
                if a[i] <= a[k]:
                    tmp.append(a[i])
                    i += 1
                else:
                    tmp.append(a[k])
                    k += 1
            while i <= m:
                tmp.append(a[i])
                i += 1
            while k <= r:
                tmp.append(a[k])
                k += 1
            a[l:r + 1] = tmp
            return cnt

        if not a:
            return 0
        return sort_count(0, len(a) - 1)
```
