## Approach

Maintain a deque of array indices whose values are in decreasing order. Remove expired indices from the front and remove smaller or equal values from the back before adding the current index. Once a complete window is available, the index at the front identifies its maximum.

## Complexity Analysis

- **Time Complexity:** O(n), where `n` is the length of `nums`; every index enters and leaves the deque at most once.
- **Space Complexity:** O(k) auxiliary space for the deque, plus O(n - k + 1) space for the returned array.

## Implementation

```python
from collections import deque
from typing import List


class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        indices = deque()
        result = []
        for i, value in enumerate(nums):
            while indices and indices[0] <= i - k:
                indices.popleft()
            while indices and nums[indices[-1]] <= value:
                indices.pop()
            indices.append(i)
            if i >= k - 1:
                result.append(nums[indices[0]])
        return result
```
