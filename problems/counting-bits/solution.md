## Approach

DP where the number of 1-bits in i is the number in i//2 plus the least significant bit.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

## Implementation

```python
from typing import List
class Solution:
    def countBits(self, n: int) -> List[int]:
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            dp[i] = dp[i >> 1] + (i & 1)
        return dp
```
