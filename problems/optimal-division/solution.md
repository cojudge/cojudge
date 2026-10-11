## Approach

Keep the first number as the numerator and make the divisor minimal. Dividing left to right already yields the smallest possible tail value, so the optimum is nums[0] divided by the parenthesised tail. Lengths one and two need no parentheses.

## Complexity Analysis

- **Time Complexity:** O(n) to join the numbers.
- **Space Complexity:** O(n) for the output string.

## Implementation

```python
from typing import List
class Solution:
    def optimalDivision(self, nums: List[int]) -> str:
        if len(nums) == 1:
            return str(nums[0])
        if len(nums) == 2:
            return f"{nums[0]}/{nums[1]}"
        return f"{nums[0]}/({'/'.join(map(str, nums[1:]))})"
```
