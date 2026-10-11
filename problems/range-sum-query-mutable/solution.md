## Approach

Simulate the script directly on a copy of the array (a segment tree gives the optimal logarithmic version); collect each range sum in order.

## Complexity Analysis

- **Time Complexity:** O(q x n) naive, O(q log n) with a segment tree
- **Space Complexity:** O(n)

## Implementation

```python
from typing import List
class Solution:
    def runNumArray(self, nums: List[int], operations: List[str], values: List[List[int]]) -> List[int]:
        a, ans = list(nums), []
        for op, v in zip(operations, values):
            if op == 'update':
                a[v[0]] = v[1]
            else:
                ans.append(sum(a[v[0]:v[1] + 1]))
        return ans
```
