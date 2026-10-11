## Approach

Place all values of the first list into a hash set, then scan the second list and collect hits into another set that automatically drops repeats. Converting the survivor set to an array finishes the task. Set lookups keep the total work linear in the combined input size.

## Complexity Analysis

- **Time Complexity:** O(n + m), where n and m are the list lengths.
- **Space Complexity:** O(n) for the lookup set.

## Implementation

```python
from typing import List
class Solution:
    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:
        have = set(nums1)
        return list({x for x in nums2 if x in have})
```
