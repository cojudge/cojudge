## Approach

Walk once and count drops where `a[i] > a[i+1]`. On the first drop, fix it in place: lower the left entry when the entry before still fits, otherwise raise the right entry. A second drop means two edits are needed, so return false.

## Complexity Analysis

- **Time Complexity:** O(n) for a single pass.
- **Space Complexity:** O(1) besides the working copy.

## Implementation

```python
from typing import List
class Solution:
    def checkPossibility(self, nums: List[int]) -> bool:
        a = list(nums)
        cnt = 0
        for i in range(len(a) - 1):
            if a[i] > a[i + 1]:
                cnt += 1
                if cnt > 1:
                    return False
                if i == 0 or a[i - 1] <= a[i + 1]:
                    a[i] = a[i + 1]
                else:
                    a[i + 1] = a[i]
        return True
```
