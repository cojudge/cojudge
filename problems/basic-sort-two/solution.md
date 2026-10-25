## Approach

Compare the two inputs once. Place the smaller one first and the larger one second to build the sorted pair.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def sortTwo(self, a: int, b: int) -> List[int]:
        if a <= b:
            return [a, b]
        return [b, a]
```
