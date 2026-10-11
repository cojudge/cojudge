## Approach

An optimal answer can always be taken as one of the array entries themselves, so test each `strs[i]` in turn. Scan every other `strs[j]` once with two pointers to decide whether `strs[i]` hides inside it as a subsequence. If no other string contains it, its length is a candidate; the maximum candidate over all positions (or `-1` when none qualifies) is the result.

## Complexity Analysis

- **Time Complexity:** O(n^2 * L), where n is the array size and L the string length, for pairwise subsequence checks.
- **Space Complexity:** O(1) extra memory.

## Implementation

```python
from typing import List

class Solution:
    def findLUSlength(self, strs: List[str]) -> int:
        def is_subseq(a, b):
            i = 0
            for c in b:
                if i < len(a) and a[i] == c:
                    i += 1
            return i == len(a)

        ans = -1
        for i, s in enumerate(strs):
            if all(i == j or not is_subseq(s, t) for j, t in enumerate(strs)):
                ans = max(ans, len(s))
        return ans
```
