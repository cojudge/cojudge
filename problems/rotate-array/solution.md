## Approach

Reduce `k` modulo `n` to handle rotations larger than the array. Then place each element at index `(i + k) % n` in a new array. An in-place alternative reverses the whole array, then reverses the first `k` elements and the remaining `n - k` elements.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the array.
- **Space Complexity:** O(n) for the returned array (O(1) extra if rotating in place with reversals).

## Implementation

```python
from typing import List
class Solution:
    def rotate(self, nums: List[int], k: int) -> List[int]:
        n = len(nums)
        if n == 0:
            return []
        k %= n
        return nums[n - k:] + nums[:n - k] if k else nums[:]
```
