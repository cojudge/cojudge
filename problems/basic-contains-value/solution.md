## Approach

Scan each element and return true the moment the target is seen. When the loop ends without a match, return false.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def containsValue(self, nums: List[int], target: int) -> bool:
        for x in nums:
            if x == target:
                return True
        return False
```
