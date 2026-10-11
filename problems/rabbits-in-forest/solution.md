## Approach

Group speakers by their answer. An answer of `a` means its color group holds
exactly `a+1` rabbits, so `c` speakers with that answer need
`ceil(c / (a+1))` full groups. Summing `groups * (a+1)` over every distinct
answer yields the smallest feasible population, with silent rabbits filling
any partially empty groups.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of answers.
- **Space Complexity:** O(n) for the frequency table.

## Implementation

```python
from typing import List
from collections import Counter
import math


class Solution:
    def numRabbits(self, answers: List[int]) -> int:
        total = 0
        for a, c in Counter(answers).items():
            size = a + 1
            groups = (c + size - 1) // size
            total += groups * size
        return total
```
