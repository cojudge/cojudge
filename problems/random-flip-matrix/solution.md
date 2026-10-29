## Approach

Sample without replacement over the `m * n` virtual cell indices using the Fisher-Yates idea with a remap table. Keep `total` as the count of still-unflipped cells: each `flip` draws a uniform index `x` from `[0, total)`, resolves it through the table (`idx = remap.get(x, x)`), then moves the pool's last element into slot `x` (`remap[x] = remap.get(total - 1, total - 1)`) and shrinks `total`. Converting via `row = idx // n`, `col = idx % n` yields distinct valid coordinates with one random call per flip. `reset` clears the table and restores `total` to `m * n`.

## Complexity Analysis

- **Time Complexity:** O(1) per `flip` and O(k) per `reset` (clearing k table entries).
- **Space Complexity:** O(k) for the remap table, where k is the number of flips since the last reset.

## Implementation

```python
import random
from typing import List, Dict

class FlipMatrix:
    def __init__(self, m: int, n: int):
        self.m = m
        self.n = n
        self.total = m * n
        self.remap: Dict[int, int] = {}

    def flip(self) -> List[int]:
        self.total -= 1
        x = random.randint(0, self.total)
        idx = self.remap.get(x, x)
        self.remap[x] = self.remap.get(self.total, self.total)
        return [idx // self.n, idx % self.n]

    def reset(self) -> None:
        self.total = self.m * self.n
        self.remap.clear()
```
