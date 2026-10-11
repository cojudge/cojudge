## Approach

Sort the numbers, then pair neighbors: (smallest, second smallest), and so on. Each pair donates its first element, so summing every other entry of the sorted array is optimal — any crossing pairing can be uncrossed without hurting the total.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting n numbers.
- **Space Complexity:** O(1) extra besides the sort.

## Implementation

```python
from typing import List

class Solution:
    def arrayPairSum(self, nums: List[int]) -> int:
        nums.sort()
        return sum(nums[::2])
```
