## Approach

Convert each number to text and order the pieces so that the glued pair looks biggest: put `a` before `b` when `a + b` exceeds `b + a`. Gluing the sorted pieces gives the largest arrangement. If the first piece is zero, every piece is zero, so return a single zero.

## Complexity Analysis

- **Time Complexity:** O(n log n * k), where n is the count and k is the average digit length for comparisons.
- **Space Complexity:** O(n * k) for the text pieces.

## Implementation

```python
from typing import List
from functools import cmp_to_key
class Solution:
    def largestNumber(self, nums: List[int]) -> str:
        strs = [str(x) for x in nums]
        strs.sort(key=cmp_to_key(lambda a, b: -1 if a + b > b + a else (1 if a + b < b + a else 0)))
        if strs[0] == "0":
            return "0"
        return "".join(strs)
```
