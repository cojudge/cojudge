## Approach

Use an `OrderedDict` as the cache. Its final entry is the most recently used key: successful reads and updates move their key to that end, while an insertion beyond capacity removes the first entry. Append results only for `get` operations, as required by the batch API.

## Complexity Analysis

- **Time Complexity:** O(q) expected for `q` operations, with O(1) expected work per operation.
- **Space Complexity:** O(c + g), where `c` is the capacity and `g` is the number of returned `get` results.

## Implementation

```python
from collections import OrderedDict
from typing import List

class Solution:
    def runLruCache(
        self, operations: List[str], args: List[List[int]]
    ) -> List[int]:
        capacity = args[0][0]
        cache = OrderedDict()
        results = []

        for operation, values in zip(operations[1:], args[1:]):
            if operation == "get":
                key = values[0]
                if key not in cache:
                    results.append(-1)
                else:
                    cache.move_to_end(key)
                    results.append(cache[key])
            else:
                key, value = values
                if key in cache:
                    cache.move_to_end(key)
                cache[key] = value
                if len(cache) > capacity:
                    cache.popitem(last=False)

        return results
```
