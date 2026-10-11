## Approach

Sort the values, then binary-search the distance. For a trial limit, a sliding window counts how many pairs fit inside it in linear time; that count rises with the limit, so the smallest limit covering at least `k` pairs is the desired k-th distance.

## Complexity Analysis

- **Time Complexity:** O(n log n + n log W), where n is the length and W the value range.
- **Space Complexity:** O(1) besides sorting.

## Implementation

```python
from typing import List
class Solution:
    def smallestDistancePair(self, nums: List[int], k: int) -> int:
        nums = sorted(nums)
        lo, hi = 0, nums[-1] - nums[0]
        def count(limit: int) -> int:
            cnt = left = 0
            for right in range(len(nums)):
                while nums[right] - nums[left] > limit:
                    left += 1
                cnt += right - left
            return cnt
        while lo < hi:
            mid = (lo + hi) // 2
            if count(mid) >= k:
                hi = mid
            else:
                lo = mid + 1
        return lo
```
