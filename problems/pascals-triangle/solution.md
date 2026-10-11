## Approach

Build rows iteratively. The first row is [1]; each following row has one more entry, with 1s on both ends and interior sums taken from adjacent pairs of the previous row. Repeating this `numRows` times yields the triangle top-down with no extra bookkeeping.

## Complexity Analysis

- **Time Complexity:** O(numRows^2), proportional to the total entries produced.
- **Space Complexity:** O(numRows^2) for the stored triangle.

## Implementation

```python
from typing import List
class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        ans = []
        for r in range(numRows):
            row = [1] * (r + 1)
            for c in range(1, r):
                row[c] = ans[r - 1][c - 1] + ans[r - 1][c]
            ans.append(row)
        return ans
```
