## Approach
Use patience sorting by maintaining a `tails` array where `tails[i]` is the smallest possible tail of an increasing subsequence of length `i + 1`. For each number, binary search to find its position in `tails` and either append or replace.

## Complexity Analysis
- **Time Complexity:** O(n log n)
- **Space Complexity:** O(n)

## Implementation
```python
from typing import List
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = []
        for x in nums:
            l, r = 0, len(tails)
            while l < r:
                m = (l + r) // 2
                if tails[m] < x:
                    l = m + 1
                else:
                    r = m
            if l == len(tails):
                tails.append(x)
            else:
                tails[l] = x
        return len(tails)
```
