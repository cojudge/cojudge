## Approach

Use a hash set to track seen elements; if any element is encountered twice, return true.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

## Implementation

```python
from typing import List
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        seen = set()
        for n in nums:
            if n in seen:
                return True
            seen.add(n)
        return False
```
