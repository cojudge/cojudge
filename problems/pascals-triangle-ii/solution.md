## Approach

Keep a single array that evolves row by row. Start with a row of ones of the target length; for each row from 2 onward update interior entries from right to left so each new entry sums the two values that sat above it. Right-to-left order preserves the previous row's values until they are consumed.

## Complexity Analysis

- **Time Complexity:** O(rowIndex^2), one update per entry of each intermediate row.
- **Space Complexity:** O(rowIndex) for the rolling row.

## Implementation

```python
from typing import List
class Solution:
    def getRow(self, rowIndex: int) -> List[int]:
        row = [1] * (rowIndex + 1)
        for r in range(2, rowIndex + 1):
            for c in range(r - 1, 0, -1):
                row[c] = row[c] + row[c - 1]
        return row
```
