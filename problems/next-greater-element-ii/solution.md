## Approach

Duplicate the circular walk by iterating `2*n` steps over indices modulo `n`. A decreasing stack holds positions still waiting for a larger value; whenever the current value exceeds the stack top, it resolves those positions. Indices are pushed only during the first lap so each is resolved at most once.

## Complexity Analysis

- **Time Complexity:** O(n) with each index pushed and popped once.
- **Space Complexity:** O(n) for the stack and answer.

## Implementation

```python
from typing import List

class Solution:
    def nextGreaterElements(self, nums: List[int]) -> List[int]:
        n = len(nums)
        ans = [-1] * n
        st: List[int] = []
        for i in range(2 * n):
            idx = i % n
            while st and nums[idx] > nums[st[-1]]:
                ans[st.pop()] = nums[idx]
            if i < n:
                st.append(idx)
        return ans
```
