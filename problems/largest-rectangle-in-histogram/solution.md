## Approach

Maintain indices of bars in non-decreasing height order. When a shorter bar is
encountered, pop each taller bar and compute the rectangle for which that bar
is the limiting height. A final virtual bar of height `0` flushes all remaining
bars from the stack.

## Complexity Analysis

- **Time Complexity:** `O(n)` because each index is pushed and popped at most once.
- **Space Complexity:** `O(n)`.

## Implementation

```python
from typing import List


class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        stack: List[int] = []
        best = 0
        for index in range(len(heights) + 1):
            current = 0 if index == len(heights) else heights[index]
            while stack and current < heights[stack[-1]]:
                height = heights[stack.pop()]
                left = stack[-1] if stack else -1
                best = max(best, height * (index - left - 1))
            stack.append(index)
        return best
```
