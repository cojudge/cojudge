## Approach

Pair a value-to-index map with a dense list of values. `insert` appends a new value at the end and records its index; `remove` swaps the target with the last entry, updates the moved entry's index, and pops the tail — all average O(1). `getRandom` draws a uniform list index.

## Complexity Analysis

- **Time Complexity:** O(1) average per operation.
- **Space Complexity:** O(n) for the list plus the index map.

## Implementation

```python
import random

class RandomizedSet:
    def __init__(self):
        self.a = []
        self.pos = {}

    def insert(self, val: int) -> bool:
        if val in self.pos:
            return False
        self.pos[val] = len(self.a)
        self.a.append(val)
        return True

    def remove(self, val: int) -> bool:
        if val not in self.pos:
            return False
        i = self.pos[val]
        last = self.a[-1]
        self.a[i] = last
        self.pos[last] = i
        self.a.pop()
        del self.pos[val]
        return True

    def getRandom(self) -> int:
        return random.choice(self.a)
```
