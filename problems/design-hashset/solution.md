## Approach

Simulate the set over the trace with a hash set: construction starts empty, `add` inserts, `remove` deletes (a no-op when absent), and `contains` checks membership. Construction, `add` and `remove` report `"null"` while each `contains` reports `"true"` or `"false"`; the full per-operation trace is compared exactly against the reference.

## Complexity Analysis

- **Time Complexity:** O(1) average per `add`, `remove` and `contains`.
- **Space Complexity:** O(k) where k is the number of stored keys.

## Implementation

```python
class MyHashSet:
    def __init__(self):
        self.s = set()

    def add(self, key: int) -> None:
        self.s.add(key)

    def remove(self, key: int) -> None:
        self.s.discard(key)

    def contains(self, key: int) -> bool:
        return key in self.s
```
