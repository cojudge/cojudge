## Approach

View the indices reachable with the current number of jumps as one breadth-first-search layer. While scanning that layer, track the farthest position reachable from any of its indices. When the scan reaches the current layer boundary, take one jump and use the farthest reach as the next boundary. The reachability guarantee ensures every new layer advances toward the last index.

## Complexity Analysis

- **Time Complexity:** O(n), because each index is scanned once.
- **Space Complexity:** O(1) auxiliary space.

## Implementation

```python
from typing import List


class Solution:
    def jump(self, nums: List[int]) -> int:
        jumps = 0
        current_end = 0
        farthest = 0
        for index in range(len(nums) - 1):
            farthest = max(farthest, index + nums[index])
            if index == current_end:
                jumps += 1
                current_end = farthest
        return jumps
```
