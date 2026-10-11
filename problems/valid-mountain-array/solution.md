## Approach

Climb from the left while each step goes strictly up. The stopping point is the only candidate summit: it must not be the first or the last slot. From there walk down while each step goes strictly down. The array is a mountain exactly when this downhill walk reaches the final index.

## Complexity Analysis

- **Time Complexity:** O(n), each element is visited at most twice.
- **Space Complexity:** O(1), only an index is stored.

## Implementation

```python
from typing import List
class Solution:
    def validMountainArray(self, arr: List[int]) -> bool:
        n = len(arr)
        if n < 3:
            return False
        i = 0
        while i + 1 < n and arr[i] < arr[i + 1]:
            i += 1
        if i == 0 or i == n - 1:
            return False
        while i + 1 < n and arr[i] > arr[i + 1]:
            i += 1
        return i == n - 1
```
