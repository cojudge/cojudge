## Approach

Sort the numbers so equal values sit together, then grow permutations one
position at a time with depth-first search. A candidate is only placed when it
forms a perfect square with the previously placed value (checked via an
integer square root). To avoid counting the same ordering twice, a repeated
value is skipped whenever its previous twin has not been used yet. Every
complete placement is one distinct squareful permutation.

## Complexity Analysis

- **Time Complexity:** O(n * n!) in the worst case, where n is the length of `nums` (at most 12). Pruning by the square condition cuts this down sharply in practice.
- **Space Complexity:** O(n) for the recursion stack, the used flags, and the sorted copy.

## Implementation

```python
from typing import List
import math
class Solution:
    def numSquarefulPerms(self, nums: List[int]) -> int:
        nums = sorted(nums)
        used = [False] * len(nums)

        def is_square(s):
            r = math.isqrt(s)
            return r * r == s

        def dfs(prev, placed):
            if placed == len(nums):
                return 1
            total = 0
            for i in range(len(nums)):
                if used[i]:
                    continue
                if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                    continue
                if prev != -1 and not is_square(prev + nums[i]):
                    continue
                used[i] = True
                total += dfs(nums[i], placed + 1)
                used[i] = False
            return total

        return dfs(-1, 0)
```
