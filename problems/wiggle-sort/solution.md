## Approach

Walk the array once and fix each adjacent pair locally: swap positions i and i+1 whenever an even index violates <= or an odd index violates >=. One pass suffices because each swap only affects the current pair's relation.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1) extra besides the returned copy.

## Implementation

```python
from typing import List
class Solution:
    def wiggleSort(self, nums: List[int]) -> List[int]:
        a = list(nums)
        for i in range(len(a) - 1):
            if (i % 2 == 0 and a[i] > a[i + 1]) or (i % 2 == 1 and a[i] < a[i + 1]):
                a[i], a[i + 1] = a[i + 1], a[i]
        return a
```
