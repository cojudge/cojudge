## Approach

Tally frequencies, then check every value against its successor. The best pair sum is the answer because any harmonious group can only contain two neighboring values.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n) for counts.

## Implementation

```python
from typing import List
from collections import Counter
class Solution:
    def findLHS(self, nums: List[int]) -> int:
        c = Counter(nums)
        return max([c[x] + c[x+1] for x in c if x+1 in c] or [0])
```
