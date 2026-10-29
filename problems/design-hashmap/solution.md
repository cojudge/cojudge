## Approach

Simulate the map over the trace with a hash map: construction starts empty, `put` inserts or overwrites, `remove` deletes (a no-op when absent), and `get` looks up with a `-1` default. Construction, `put` and `remove` report `"null"` while each `get` reports the plain integer result; the full per-operation trace is compared exactly against the reference.

## Complexity Analysis

- **Time Complexity:** O(1) average per `put`, `get` and `remove`.
- **Space Complexity:** O(k) where k is the number of stored keys.

## Implementation

```python
class MyHashMap:
    def __init__(self):
        self.m = {}

    def put(self, key: int, value: int) -> None:
        self.m[key] = value

    def get(self, key: int) -> int:
        return self.m.get(key, -1)

    def remove(self, key: int) -> None:
        self.m.pop(key, None)
```
