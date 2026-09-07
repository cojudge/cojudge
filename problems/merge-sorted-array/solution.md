## Approach

Merge from the back of `nums1` (or with a new result array): compare the largest remaining elements of the first `m` entries of `nums1` and the first `n` entries of `nums2`, placing the larger one at the end of the result and moving the corresponding pointer. When one side is exhausted, copy the remainder of the other side.

## Complexity Analysis

- **Time Complexity:** O(m + n). Each element is visited once.
- **Space Complexity:** O(m + n) for the returned array (O(1) extra if merging in place from the back).

## Implementation

```python
from typing import List
class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> List[int]:
        a = nums1[:m]
        b = nums2[:n]
        i = j = 0
        res = []
        while i < m and j < n:
            if a[i] <= b[j]:
                res.append(a[i]); i += 1
            else:
                res.append(b[j]); j += 1
        res.extend(a[i:])
        res.extend(b[j:])
        return res
```
