## Approach

Allocate an answer array of the same length. Copy elements from the back of the input to the front of the answer.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n).

## Implementation

```python
from typing import List

class Solution:
    def reverseArray(self, nums: List[int]) -> List[int]:
        return nums[::-1]
```
