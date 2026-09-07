## Approach

Maintain a sliding window of the last `k` elements in a hash set. For each `nums[i]`, if it is already in the set there are two equal values within distance `k`, so return true. Otherwise insert it and, when the window grows beyond `k`, evict `nums[i-k]`.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the array. Each element is inserted and removed at most once.
- **Space Complexity:** O(min(n, k)). The set holds at most `k` recent elements.

## Implementation

```python
from typing import List
class Solution:
    def containsNearbyDuplicate(self, nums: List[int], k: int) -> bool:
        seen = set()
        for i, v in enumerate(nums):
            if v in seen:
                return True
            seen.add(v)
            if len(seen) > k:
                seen.remove(nums[i - k])
        return False
```
