## Approach

A permutation has a non-local inversion exactly when some value reaches at least two spots forward past a larger prefix. Scanning from left to right while remembering the maximum of all entries at least two positions behind the cursor detects that event: if the remembered maximum ever exceeds the current value, a global inversion without a local witness exists.

## Complexity Analysis

- **Time Complexity:** O(n) for one linear scan.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
from typing import List
class Solution:
    def isIdealPermutation(self, nums: List[int]) -> bool:
        cmax = -1
        for i in range(2, len(nums)):
            cmax = max(cmax, nums[i - 2])
            if cmax > nums[i]:
                return False
        return True
```
