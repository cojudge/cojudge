## Approach

Scan the array once while marking seen values; the first repeat is the duplicate. Track the distinct values' sum and subtract it from the ideal total n(n+1)/2 to reveal the missing number. Return them as [duplicate, missing].

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length.
- **Space Complexity:** O(n) for the seen flags.

## Implementation

```python
from typing import List

class Solution:
    def findErrorNums(self, nums: List[int]) -> List[int]:
        seen = set()
        dup = -1
        for v in nums:
            if v in seen:
                dup = v
            seen.add(v)
        n = len(nums)
        missing = n * (n + 1) // 2 - sum(seen)
        return [dup, missing]
```
