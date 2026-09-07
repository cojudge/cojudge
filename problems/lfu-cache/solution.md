## Approach

Maintain `key -> value`, `key -> frequency`, and `frequency -> ordered keys`
(`LinkedHashSet` preserves LRU order within a frequency). Track `minFreq`.
On `get`, bump the key's frequency and move it between groups, fixing `minFreq`
when its group empties. On `put`, update existing keys the same way; for new
keys evict the oldest key of the `minFreq` group when full, insert with
frequency `1`, and reset `minFreq` to `1`.

## Complexity Analysis

- **Time Complexity:** `O(1)` average per `get`/`put`.
- **Space Complexity:** `O(capacity)` for the maps and groups.

## Implementation

```python
from collections import OrderedDict, defaultdict
from typing import List


class Solution:
    def runLfuCache(self, operations: List[str], args: List[List[int]]) -> List[int]:
        capacity = args[0][0]
        values: dict[int, int] = {}
        freqs: dict[int, int] = {}
        groups: dict[int, OrderedDict[int, None]] = defaultdict(OrderedDict)
        min_freq = 0
        results: List[int] = []
        for operation, arg in zip(operations[1:], args[1:]):
            if operation == "get":
                key = arg[0]
                if key not in values:
                    results.append(-1)
                else:
                    f = freqs[key]
                    del groups[f][key]
                    if f == min_freq and not groups[f]:
                        min_freq += 1
                    freqs[key] = f + 1
                    groups[f + 1][key] = None
                    results.append(values[key])
            else:
                key, value = arg[0], arg[1]
                if capacity == 0:
                    continue
                if key in values:
                    values[key] = value
                    f = freqs[key]
                    del groups[f][key]
                    if f == min_freq and not groups[f]:
                        min_freq += 1
                    freqs[key] = f + 1
                    groups[f + 1][key] = None
                else:
                    if len(values) == capacity:
                        evict, _ = groups[min_freq].popitem(last=False)
                        del values[evict]
                        del freqs[evict]
                    values[key] = value
                    freqs[key] = 1
                    groups[1][key] = None
                    min_freq = 1
        return results
```
