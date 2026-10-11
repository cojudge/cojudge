## Approach

Keep a difference array: add each increment at its start index and subtract it just past its end index. A single left-to-right running total then reconstructs the value at every position, since each range contributes exactly while the scan is inside it.

## Complexity Analysis

- **Time Complexity:** O(k + n), where k is the number of triples and n is `length`.
- **Space Complexity:** O(n) for the difference buffer and the answer.

## Implementation

```python
from typing import List
class Solution:
    def getModifiedArray(self, length: int, updates: List[List[int]]) -> List[int]:
        diff = [0] * (length + 1)
        for s, e, v in updates:
            diff[s] += v
            if e + 1 < len(diff):
                diff[e + 1] -= v
        ans = [0] * length
        cur = 0
        for i in range(length):
            cur += diff[i]
            ans[i] = cur
        return ans
```
