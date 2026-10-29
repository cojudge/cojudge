## Approach

Keep a list of values plus, per value, the set of list positions holding it. `insert` appends the value and records the new index, reporting whether no copy existed before. `remove` takes an arbitrary recorded index for the value, swaps that slot with the tail, fixes both values' index sets, and pops — deleting exactly one copy. `getRandom` draws a uniform list position, so multiplicity is respected automatically.

## Complexity Analysis

- **Time Complexity:** O(1) average per operation.
- **Space Complexity:** O(n) for the list plus the per-value index sets.

## Implementation

```python
import random
from collections import defaultdict

class RandomizedCollection:
    def __init__(self):
        self.a = []
        self.pos = defaultdict(set)

    def insert(self, val: int) -> bool:
        fresh = len(self.pos[val]) == 0
        self.pos[val].add(len(self.a))
        self.a.append(val)
        return fresh

    def remove(self, val: int) -> bool:
        if not self.pos[val]:
            return False
        i = next(iter(self.pos[val]))
        self.pos[val].discard(i)
        last = self.a[-1]
        if i != len(self.a) - 1:
            self.a[i] = last
            self.pos[last].discard(len(self.a) - 1)
            self.pos[last].add(i)
        self.a.pop()
        if not self.pos[val]:
            del self.pos[val]
        return True

    def getRandom(self) -> int:
        return random.choice(self.a)
```
