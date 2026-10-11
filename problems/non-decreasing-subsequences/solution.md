## Approach

Depth-first search builds subsequences in index order. A new element is appended only when it keeps the path non-decreasing. At each depth a per-level set remembers which values were already branched on, so duplicate value sequences from different positions are generated once. Every path of length two or more is recorded.

## Complexity Analysis

- **Time Complexity:** O(2^n * n) with n up to 15; each subset is considered once.
- **Space Complexity:** O(n) recursion depth plus the output storage.

## Implementation

```python
from typing import List

class Solution:
    def findSubsequences(self, nums: List[int]) -> List[List[int]]:
        res: List[List[int]] = []
        cur: List[int] = []

        def dfs(idx: int) -> None:
            if len(cur) >= 2:
                res.append(list(cur))
            used = set()
            for i in range(idx, len(nums)):
                if cur and nums[i] < cur[-1]:
                    continue
                if nums[i] in used:
                    continue
                used.add(nums[i])
                cur.append(nums[i])
                dfs(i + 1)
                cur.pop()

        dfs(0)
        return res
```
