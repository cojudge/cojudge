## Approach

Express every range sum as a difference of two prefix sums, turning the task into counting ordered prefix pairs whose difference lies in `[lower, upper]`. A merge sort over the prefix array counts the cross pairs spanning the midpoint with two sliding pointers before merging the halves back into order.

## Complexity Analysis

- **Time Complexity:** O(n log n), where n is the length of `nums`.
- **Space Complexity:** O(n) for the prefix array and merge buffer.

## Implementation

```python
from typing import List
class Solution:
    def countRangeSum(self, nums: List[int], lower: int, upper: int) -> int:
        prefix = [0]
        for v in nums:
            prefix.append(prefix[-1] + v)

        def sort_count(lo: int, hi: int) -> int:
            if hi - lo <= 1:
                return 0
            mid = (lo + hi) // 2
            count = sort_count(lo, mid) + sort_count(mid, hi)
            j = k = mid
            for i in range(lo, mid):
                while k < hi and prefix[k] - prefix[i] < lower:
                    k += 1
                while j < hi and prefix[j] - prefix[i] <= upper:
                    j += 1
                count += j - k
            prefix[lo:hi] = sorted(prefix[lo:hi])
            return count

        return sort_count(0, len(prefix))
```
