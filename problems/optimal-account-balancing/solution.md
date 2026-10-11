## Approach

First compress every transfer into a single net balance per person and discard the zero balances; only these debts matter. Then backtrack: take the first unsettled account and try merging it into each later account of opposite sign, which models one settlement payment clearing the current account. Recurse, undo, and keep the smallest count, with a pruning break when a merge zeroes out its partner (symmetric alternatives cannot do better).

## Complexity Analysis

- **Time Complexity:** O(n!), with n the number of non-zero balances (at most a dozen here), for the pairing search.
- **Space Complexity:** O(n) for the recursion stack and balance list.

## Implementation

```python
from typing import List

class Solution:
    def minTransfers(self, transactions: List[List[int]]) -> int:
        bal = {}
        for f, t, a in transactions:
            bal[f] = bal.get(f, 0) - a
            bal[t] = bal.get(t, 0) + a
        debts = [v for v in bal.values() if v != 0]

        def settle(start: int) -> int:
            while start < len(debts) and debts[start] == 0:
                start += 1
            if start == len(debts):
                return 0
            best = float("inf")
            for i in range(start + 1, len(debts)):
                if debts[start] * debts[i] < 0:
                    debts[i] += debts[start]
                    best = min(best, 1 + settle(start + 1))
                    debts[i] -= debts[start]
                    if debts[i] + debts[start] == 0:
                        break
            return best

        return settle(0)
```
