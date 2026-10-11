## Approach

Sort the values so every divisor appears before its multiples. Run a longest-chain dynamic program where each position extends the best earlier divisor, tracking predecessors to rebuild one optimal group. Sorting makes consecutive divisibility imply pairwise divisibility by transitivity.

## Complexity Analysis

- **Time Complexity:** O(n^2), where n is the length of `nums`, dominated by the pairwise divisibility checks after an O(n log n) sort.
- **Space Complexity:** O(n) for the DP lengths, predecessors, and the rebuilt chain.

## Implementation

```python
from typing import List
class Solution:
    def largestDivisibleSubset(self, nums: List[int]) -> List[int]:
        s = sorted(nums)
        n = len(s)
        dp = [1] * n
        prev = [-1] * n
        best = 0
        for i in range(n):
            for j in range(i):
                if s[i] % s[j] == 0 and dp[j] + 1 > dp[i]:
                    dp[i] = dp[j] + 1
                    prev[i] = j
            if dp[i] > dp[best]:
                best = i
        chain = []
        i = best
        while i != -1:
            chain.append(s[i])
            i = prev[i]
        return chain
```
