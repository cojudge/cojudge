## Approach

Rather than comparing every pair, tally each binary column separately. For a fixed bit, suppose `c` of the `n` numbers have a 1 there; then exactly `c * (n - c)` pairs differ in that column. Adding this quantity over all 31 columns yields the total gap count.

## Complexity Analysis

- **Time Complexity:** O(31 * n), linear in the array size.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def totalHammingDistance(self, nums: List[int]) -> int:
        n = len(nums)
        total = 0
        for bit in range(31):
            ones = sum(1 for v in nums if (v >> bit) & 1)
            total += ones * (n - ones)
        return total
```
