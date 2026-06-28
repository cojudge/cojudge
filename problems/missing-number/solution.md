## Approach

Compute the expected sum of numbers from 0 to n using the formula `n*(n+1)/2` and subtract the actual sum of the array to find the missing number.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        n = len(nums)
        return (n * (n + 1) // 2) - sum(nums)
```
