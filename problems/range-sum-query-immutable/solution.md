## Approach

Build one prefix-sum array up front; every [left, right] query is then answered by a single subtraction.

## Complexity Analysis

- **Time Complexity:** O(n + q)
- **Space Complexity:** O(n)

## Implementation

```python
from typing import List
class Solution:
    def runNumArray(self, nums: List[int], queries: List[List[int]]) -> List[int]:
        pref = [0]
        for v in nums:
            pref.append(pref[-1] + v)
        return [pref[r + 1] - pref[l] for l, r in queries]
```
