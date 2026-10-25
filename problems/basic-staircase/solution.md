## Approach

Build each row with an inner loop appending one star at a time. Collect the n rows in order into a list.

## Complexity Analysis

- **Time Complexity:** O(n^2).
- **Space Complexity:** O(n^2).

## Implementation

```python
from typing import List

class Solution:
    def staircase(self, n: int) -> List[str]:
        return ['*' * i for i in range(1, n + 1)]
```
