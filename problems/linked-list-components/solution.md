## Approach

Put all of `nums` into a hash set. Then sweep the linked list once, tracking whether the previous node was part of the set. Each time a matching node appears right after a non-matching stretch (or the start), a new component begins and the counter grows. This counts maximal runs in one pass.

## Complexity Analysis

- **Time Complexity:** O(n + m) for a list of n nodes and m query values.
- **Space Complexity:** O(m) for the lookup set.

## Implementation

```python
from typing import List
class Solution:
    def numComponents(self, head, nums: List[int]) -> int:
        wanted = set(nums)
        ans = 0
        in_run = False
        cur = head
        while cur is not None:
            if cur.val in wanted:
                if not in_run:
                    ans += 1
                    in_run = True
            else:
                in_run = False
            cur = cur.next
        return ans
```
