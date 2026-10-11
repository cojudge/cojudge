## Approach

Windows with exactly `k` distinct values equal windows with at most `k` minus
windows with at most `k - 1`. The at-most count comes from a single sliding
window: expand the right end, track frequencies in a hash map, and shrink the
left end while more than `k` distinct values are present. With the window
valid, every start position between left and right forms a good subarray, so
the right end contributes `right - left + 1` windows.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`. Each index enters and leaves the window once per pass, and two passes run.
- **Space Complexity:** O(k) for the frequency map.

## Implementation

```python
from typing import List
class Solution:
    def subarraysWithKDistinct(self, nums: List[int], k: int) -> int:
        def at_most(k):
            if k < 0:
                return 0
            count = {}
            left = 0
            ans = 0
            for right, v in enumerate(nums):
                count[v] = count.get(v, 0) + 1
                while len(count) > k:
                    lv = nums[left]
                    count[lv] -= 1
                    if count[lv] == 0:
                        del count[lv]
                    left += 1
                ans += right - left + 1
            return ans
        return at_most(k) - at_most(k - 1)
```
