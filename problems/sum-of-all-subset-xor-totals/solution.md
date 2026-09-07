## Approach

Enumerate every subset with a recursive include/exclude search. At each position we branch into two choices: leave `nums[i]` out of the subset (keeping the current XOR total unchanged) or include it (XOR-ing `nums[i]` into the current total). When the end of the array is reached, the accumulated XOR total of that subset is added to the result.

## Complexity Analysis

- **Time Complexity:** O(2^n), where n is the length of `nums`, since every subset is visited exactly once.
- **Space Complexity:** O(n) for the recursion stack (excluding the implicit output of the aggregate sum).

## Implementation

```python
from typing import List


class Solution:
    def subsetXORSum(self, nums: List[int]) -> int:
        def collect(index: int, current: int) -> int:
            if index == len(nums):
                return current
            skip = collect(index + 1, current)
            take = collect(index + 1, current ^ nums[index])
            return skip + take

        return collect(0, 0)
```