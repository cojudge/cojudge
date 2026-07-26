## Approach

Track the minimum accumulated cost of standing on the previous two stairs. The cost
for the current stair is its own cost plus the smaller of those two values. After the
last stair, the top is reachable from either of the final two stairs, so return their
minimum.

## Complexity Analysis

- **Time Complexity:** O(n), where `n` is the number of stairs.
- **Space Complexity:** O(1) auxiliary space.

## Implementation

```python
from typing import List


class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        two_back, one_back = cost[0], cost[1]
        for i in range(2, len(cost)):
            two_back, one_back = one_back, cost[i] + min(two_back, one_back)
        return min(two_back, one_back)
```
