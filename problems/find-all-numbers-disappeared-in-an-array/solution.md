## Approach

Flag each seen value in a boolean table of size `n+1`, which is valid because inputs lie in `1..n`. Then walk `1` through `n` and gather every index that stayed unflagged. The walk is already increasing, so the answer arrives sorted.

## Complexity Analysis

- **Time Complexity:** O(n), two linear passes.
- **Space Complexity:** O(n) for the presence table.

## Implementation

```python
from typing import List
class Solution:
    def findDisappearedNumbers(self, nums: List[int]) -> List[int]:
        n = len(nums)
        present = [False] * (n + 1)
        for x in nums:
            if 1 <= x <= n:
                present[x] = True
        return [i for i in range(1, n + 1) if not present[i]]
```
