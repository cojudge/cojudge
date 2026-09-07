## Approach

Use the Boyer-Moore voting algorithm: maintain a candidate and a count. For each element, if the count is zero take the element as the new candidate; else increment the count on a match and decrement otherwise. Since the majority appears more than half the time, the surviving candidate is the majority.

## Complexity Analysis

- **Time Complexity:** O(n), single pass over `nums`.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        cand = nums[0]
        cnt = 0
        for x in nums:
            if cnt == 0:
                cand = x
                cnt = 1
            elif x == cand:
                cnt += 1
            else:
                cnt -= 1
        return cand
```
