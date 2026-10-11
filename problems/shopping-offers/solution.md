## Approach

Search over the remaining-needs vector. The cost of buying everything left at shelf price is always achievable and seeds the best answer. For each bundle that fits entirely inside the remaining needs, subtract it, solve the smaller state recursively, and add the bundle price. Memoizing on the needs tuple keeps the search small.

## Complexity Analysis

- **Time Complexity:** O(S * states), where S is the number of useful bundles and states is the number of distinct needs vectors.
- **Space Complexity:** O(states) for the memo table plus recursion depth.

## Implementation

```python
from typing import List

class Solution:
    def shoppingOffers(self, price: List[int], special: List[List[int]], needs: List[int]) -> int:
        n = len(price)
        offers = [s for s in special if sum(s[i] * price[i] for i in range(n)) > s[n]]
        memo = {}
        def dfs(cur):
            key = tuple(cur)
            if key in memo:
                return memo[key]
            best = sum(cur[i] * price[i] for i in range(n))
            for s in offers:
                if all(s[i] <= cur[i] for i in range(n)):
                    nxt = [cur[i] - s[i] for i in range(n)]
                    best = min(best, s[n] + dfs(nxt))
            memo[key] = best
            return best
        return dfs(list(needs))
```
