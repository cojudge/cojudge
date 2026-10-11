## Approach

Collect candidate left endpoints by scanning once and keeping indices with strictly decreasing values on a stack — any useful left end must be a new minimum. Then scan right endpoints from the far right, popping stack entries that the current right end can pair with; the first pop for each right end is its widest partner. Tracking the best distance yields the answer.

## Complexity Analysis

- **Time Complexity:** O(n) — each index is pushed and popped at most once.
- **Space Complexity:** O(n) for the decreasing stack.

## Implementation

```python
class Solution:
    def maxWidthRamp(self, nums: list[int]) -> int:
        n = len(nums)
        st = []
        for i in range(n):
            if not st or nums[i] < nums[st[-1]]:
                st.append(i)
        best = 0
        for j in range(n - 1, -1, -1):
            while st and nums[st[-1]] <= nums[j]:
                best = max(best, j - st.pop())
            if not st:
                break
        return best
```
