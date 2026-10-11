## Approach

Scan the array while tracking the running prefix sum. A subarray ending at `i` sums to `k` exactly when an earlier prefix equals `prefix - k`. Storing each prefix sum's first occurrence in a hash map lets us measure the longest such subarray ending at every position in one pass.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`.
- **Space Complexity:** O(n) for the prefix map.

## Implementation

```python
from typing import List
class Solution:
    def maxSubArrayLen(self, nums: List[int], k: int) -> int:
        first = {0: -1}
        prefix = 0
        best = 0
        for i, v in enumerate(nums):
            prefix += v
            if prefix - k in first:
                best = max(best, i - first[prefix - k])
            if prefix not in first:
                first[prefix] = i
        return best
```
