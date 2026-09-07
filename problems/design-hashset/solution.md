## Approach

Simulate a hash set over the trace. Keep a Python `set` that is cleared on `MyHashSet`, inserts on `add`, discards on `remove`, and appends `1` or `0` on each `contains` depending on membership. Only `contains` produces output, preserving query order.

## Complexity Analysis

- **Time Complexity:** `O(m)` average for `m` operations, with `O(1)` average per set operation.
- **Space Complexity:** `O(k)` where `k` is the number of distinct stored keys (plus `O(q)` for `q` contains answers).

## Implementation

```python
from typing import List


class Solution:
    def runHashSet(self, operations: List[str], values: List[int]) -> List[int]:
        s = set()
        answers: List[int] = []
        for operation, value in zip(operations, values):
            if operation == "MyHashSet":
                s.clear()
            elif operation == "add":
                s.add(value)
            elif operation == "remove":
                s.discard(value)
            elif operation == "contains":
                answers.append(1 if value in s else 0)
        return answers
```
