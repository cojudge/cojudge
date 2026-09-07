## Approach

Use cyclic sort in place: for each index `i`, while `nums[i]` is in `[1, n]` and not already at its target `nums[v-1]`, swap it to position `v-1`. After this pass, every placeable value sits at its correct index. Scan for the first `i` with `nums[i] != i+1` and return `i+1`; if all match, return `n+1`.

## Complexity Analysis

- **Time Complexity:** O(n), each element is swapped at most once into place plus one scan.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List
class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)
        i = 0
        while i < n:
            v = nums[i]
            if 1 <= v <= n and nums[v - 1] != v:
                nums[i], nums[v - 1] = nums[v - 1], nums[i]
            else:
                i += 1
        for i, v in enumerate(nums):
            if v != i + 1:
                return i + 1
        return n + 1
```
