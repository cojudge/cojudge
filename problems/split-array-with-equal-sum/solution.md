## Approach

Build prefix sums for O(1) interval totals. Try each middle cut j: gather sums where the first two blocks match into a set, then scan right cuts k and succeed when the last two blocks match a value already seen.

## Complexity Analysis

- **Time Complexity:** O(n^2) over choices of j with inner scans.
- **Space Complexity:** O(n) for prefix sums plus the candidate set.

## Implementation

```python
from typing import List
class Solution:
    def splitArray(self, nums: List[int]) -> bool:
        n = len(nums)
        if n < 7:
            return False
        s = [0] * (n + 1)
        for i, v in enumerate(nums):
            s[i + 1] = s[i] + v
        for j in range(3, n - 3):
            seen = set()
            for i in range(1, j - 1):
                if s[i] == s[j] - s[i + 1]:
                    seen.add(s[i])
            for k in range(j + 2, n - 1):
                if s[n] - s[k + 1] == s[k] - s[j + 1] and (s[n] - s[k + 1]) in seen:
                    return True
        return False
```
