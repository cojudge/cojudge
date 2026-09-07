## Approach

Simulate a hash map over the trace. Keep a Python `dict` cleared on `MyHashMap`. On `put` store `args[i][0] -> args[i][1]` (updating existing keys); on `remove` delete the key if present; on `get` append the mapped value or `-1`. Only `get` produces output, preserving query order.

## Complexity Analysis

- **Time Complexity:** `O(m)` average for `m` operations, with `O(1)` average per map operation.
- **Space Complexity:** `O(k)` where `k` is the number of stored keys (plus `O(q)` for `q` get answers).

## Implementation

```python
from typing import List


class Solution:
    def runHashMap(self, operations: List[str], args: List[List[int]]) -> List[int]:
        m = {}
        answers: List[int] = []
        for operation, arg in zip(operations, args):
            if operation == "MyHashMap":
                m.clear()
            elif operation == "put":
                m[arg[0]] = arg[1]
            elif operation == "get":
                answers.append(m.get(arg[0], -1))
            elif operation == "remove":
                m.pop(arg[0], None)
        return answers
```
