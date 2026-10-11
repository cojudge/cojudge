## Approach

Sort a copy of the array so clashes become neighbours. Then sweep from left to right: each entry must end up strictly above the previous final value, so whenever it is at or below that value, raise it to exactly one more than the predecessor and charge the difference. This greedy lift is minimal because every duplicate has to move at least that far.

## Complexity Analysis

- **Time Complexity:** O(n log n), dominated by sorting.
- **Space Complexity:** O(n) for the sorted copy.

## Implementation

```python
from typing import List
class Solution:
    def minIncrementForUnique(self, nums: List[int]) -> int:
        a = sorted(nums)
        moves = 0
        for i in range(1, len(a)):
            if a[i] <= a[i - 1]:
                need = a[i - 1] + 1
                moves += need - a[i]
                a[i] = need
        return moves
```
