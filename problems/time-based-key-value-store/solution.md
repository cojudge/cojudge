## Approach

Replay the operations in order while storing a timestamped list for each key. The guaranteed increasing set timestamps allow each new pair to be appended. For each `get`, binary-search that key's list for the rightmost timestamp no greater than the query and append only that result to the returned list.

## Complexity Analysis

- **Time Complexity:** O(S + sum(log s_k)) across all operations, where `S` is the number of `set` operations and `s_k` is the number of stored values for the key used by each `get`. The worst case is O(q log q) for `q` operations.
- **Space Complexity:** O(S) auxiliary space for stored history, plus O(G) for the returned results from `G` get operations.

## Implementation

```python
from typing import Dict, List, Tuple


class Solution:
    def runTimeMap(
        self,
        operations: List[str],
        keys: List[str],
        values: List[str],
        timestamps: List[int],
    ) -> List[str]:
        history: Dict[str, List[Tuple[int, str]]] = {}
        result = []

        for operation, key, value, timestamp in zip(
            operations, keys, values, timestamps
        ):
            if operation == "set":
                history.setdefault(key, []).append((timestamp, value))
                continue

            entries = history.get(key, [])
            left, right, best = 0, len(entries) - 1, -1
            while left <= right:
                middle = left + (right - left) // 2
                if entries[middle][0] <= timestamp:
                    best = middle
                    left = middle + 1
                else:
                    right = middle - 1
            result.append("" if best < 0 else entries[best][1])

        return result
```
