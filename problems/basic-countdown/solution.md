## Approach

Allocate an array of length n. Fill each position i with n minus i so the values descend from n to one.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n).

## Implementation

```python
from typing import List

class Solution:
    def countdown(self, n: int) -> List[int]:
        return [n - i for i in range(n)]
```
