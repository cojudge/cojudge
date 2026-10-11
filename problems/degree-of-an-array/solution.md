## Approach

Make one pass remembering, per value, how many times it appears and where it first and last shows up. The maximum count is the degree. Any value attaining that count needs a block stretching from its first to its last occurrence; the shortest such stretch over all top-frequency values is the answer.

## Complexity Analysis

- **Time Complexity:** O(n) for the single scan plus map work.
- **Space Complexity:** O(n) for the tables in the worst case.

## Implementation

```python
from typing import List
class Solution:
    def findShortestSubArray(self, nums: List[int]) -> int:
        count, first, last = {}, {}, {}
        for i, v in enumerate(nums):
            count[v] = count.get(v, 0) + 1
            if v not in first:
                first[v] = i
            last[v] = i
        deg = max(count.values())
        return min(last[v]-first[v]+1 for v, c in count.items() if c == deg)
```
