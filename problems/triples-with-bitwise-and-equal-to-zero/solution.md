## Approach

First tabulate how often each pairwise AND value occurs by combining every pair of entries. Then, for each distinct pair value p with frequency c and each array element x, the triples extending that pair qualify exactly when p AND x is zero, contributing c to the answer. This replaces the cubic enumeration with a quadratic plus distinct-times-linear pass.

## Complexity Analysis

- **Time Complexity:** O(n^2 + d*n), where n is the array length and d is the number of distinct pair ANDs (at most 2^16).
- **Space Complexity:** O(d) for the pair frequency table.

## Implementation

```python
from typing import List
from collections import Counter
class Solution:
    def countTriplets(self, nums: List[int]) -> int:
        pair = Counter()
        for a in nums:
            for b in nums:
                pair[a & b] += 1
        ans = 0
        for p, c in pair.items():
            for x in nums:
                if p & x == 0:
                    ans += c
        return ans
```
