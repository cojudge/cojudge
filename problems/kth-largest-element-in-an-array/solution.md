## Approach

Sort a copy of the array in ascending order. The kth largest value is then at index `-k`, and duplicate values naturally occupy separate positions.

## Complexity Analysis

- **Time Complexity:** O(n log n), where `n` is `nums.length`.
- **Space Complexity:** O(n) for the sorted copy.

## Implementation

```python
from typing import List


class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        return sorted(nums)[-k]
```
