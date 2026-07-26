## Approach

XOR every array value into one accumulator. XOR is associative and commutative, and each paired value cancels itself because `a ^ a == 0`. The only value left in the accumulator is the unpaired number.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List


class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        result = 0
        for value in nums:
            result ^= value
        return result
```
