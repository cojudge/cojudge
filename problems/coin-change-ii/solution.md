## Approach

Let `combinations[value]` be the number of ways to form `value` using the coins seen so
far. Initialize the empty combination for amount zero, then process each coin in the
outer loop. This ordering counts combinations without counting different permutations
of the same coins.

## Complexity Analysis

- **Time Complexity:** O(n * amount), where `n` is the number of denominations.
- **Space Complexity:** O(amount).

## Implementation

```python
from typing import List


class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        combinations = [0] * (amount + 1)
        combinations[0] = 1
        for coin in coins:
            for value in range(coin, amount + 1):
                combinations[value] += combinations[value - coin]
        return combinations[amount]
```
