## Approach

Accumulate column heights of consecutive 1s row by row, turning each row into a histogram. Evaluate every histogram with a monotone stack that pops taller bars and measures height times available width, keeping the maximum over all rows.

## Complexity Analysis

- **Time Complexity:** O(m*n), each cell pushed and popped at most once.
- **Space Complexity:** O(n) for the heights and the stack.

## Implementation

```python
from typing import List
class Solution:
    def maximalRectangle(self, matrix: List[List[str]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        n = len(matrix[0])
        h = [0] * (n + 1)
        best = 0
        for row in matrix:
            for j in range(n):
                h[j] = h[j] + 1 if row[j] == "1" else 0
            st = []
            for j in range(n + 1):
                cur = 0 if j == n else h[j]
                while st and cur < h[st[-1]]:
                    height = h[st.pop()]
                    left = st[-1] if st else -1
                    best = max(best, height * (j - left - 1))
                st.append(j)
        return best
```
