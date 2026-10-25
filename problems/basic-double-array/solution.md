## Approach

Create an output array of matching length. Fill each slot with twice the corresponding input value.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n).

## Implementation

```python
from typing import List

class Solution:
    def doubleArray(self, nums: List[int]) -> List[int]:
        return [x * 2 for x in nums]
```
