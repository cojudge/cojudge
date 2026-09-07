## Approach

Allocate an answer array of length `2 * n`. Copy each element `nums[i]` to positions `i` and `i + n`. Equivalently, return `nums` concatenated with itself.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`. Each element is copied twice.
- **Space Complexity:** O(n) for the output array of length `2n` (excluding output, O(1) extra).

## Implementation

```python
from typing import List
class Solution:
    def getConcatenation(self, nums: List[int]) -> List[int]:
        n = len(nums)
        ans = [0] * (2 * n)
        for i, v in enumerate(nums):
            ans[i] = v
            ans[i + n] = v
        return ans
```
