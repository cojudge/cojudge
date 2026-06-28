## Approach

Use a hash map to store each element's value and its index while iterating through the array. For each element `nums[i]`, compute the complement `target - nums[i]`. If the complement exists in the hash map, return the current index `i` and the stored index of the complement. This avoids a nested loop, achieving a single pass through the array.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the input array. Each element is visited once, and hash map lookups are O(1) on average.
- **Space Complexity:** O(n). In the worst case, we store nearly all elements in the hash map before finding the pair.

## Implementation

```python
from typing import List
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, v in enumerate(nums):
            want = target - v
            if want in seen:
                return [seen[want], i]
            seen[v] = i
        return []
```
