## Approach

Moving every element to a shared target costs the sum of absolute deviations, and that sum is minimized at any median of the data. Sort the array, read off the middle element, and accumulate the absolute gaps to it. Shifting the target away from the median raises as much distance on one side as it saves on the other, so the median choice is optimal.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting.
- **Space Complexity:** O(1) extra space besides sorting.

## Implementation

```python
class Solution:
    def minMoves2(self, nums: list) -> int:
        nums = sorted(nums)
        med = nums[len(nums) // 2]
        return sum(abs(v - med) for v in nums)
```
