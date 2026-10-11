## Approach

Rows `1` through `k` consume `k*(k+1)/2` coins. The wanted `k` is the largest value with that sum at most `n`. Solving the quadratic equality gives `k = (sqrt(1+8n)-1)/2`, floored to an integer.

## Complexity Analysis

- **Time Complexity:** O(1) arithmetic.
- **Space Complexity:** O(1).

## Implementation

```python
import math
class Solution:
    def arrangeCoins(self, n: int) -> int:
        return int((math.sqrt(1 + 8 * n) - 1) // 2)
```
