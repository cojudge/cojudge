## Approach

Use prefix sums with a frequency table. As we extend the running total, the number of earlier prefixes equal to `sum - goal` tells how many subarrays ending here hit the target. Seed the table with one empty prefix so subarrays starting at zero are counted.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`. Single pass with hash lookups.
- **Space Complexity:** O(n) for the prefix frequency table.

## Implementation

```python
from typing import List
from collections import defaultdict
class Solution:
    def numSubarraysWithSum(self, nums: List[int], goal: int) -> int:
        freq = defaultdict(int)
        freq[0] = 1
        s = 0
        ans = 0
        for v in nums:
            s += v
            ans += freq[s - goal]
            freq[s] += 1
        return ans
```
