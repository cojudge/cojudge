## Approach

At most two values can exceed `n/3` occurrences. Run extended Boyer-Moore with two candidates and counters: match a candidate to increment, fill an empty slot (count zero) with a new candidate, else decrement both. Then verify each candidate with a counting pass and keep those strictly above `n/3`.

## Complexity Analysis

- **Time Complexity:** O(n), two passes over `nums`.
- **Space Complexity:** O(1) extra (excluding the output of at most two elements).

## Implementation

```python
from typing import List
class Solution:
    def majorityElement(self, nums: List[int]) -> List[int]:
        c1 = c2 = None
        n1 = n2 = 0
        for x in nums:
            if c1 == x:
                n1 += 1
            elif c2 == x:
                n2 += 1
            elif n1 == 0:
                c1, n1 = x, 1
            elif n2 == 0:
                c2, n2 = x, 1
            else:
                n1 -= 1
                n2 -= 1
        res = []
        th = len(nums) // 3
        for c in (c1, c2):
            if c is not None and nums.count(c) > th and c not in res:
                res.append(c)
        return res
```
