## Approach

Store each full key with its latest value in a hash map; inserts overwrite. To answer a prefix sum, scan all entries and add values whose key starts with the prefix. With tiny test sizes this direct scan is clear and fast enough.

## Complexity Analysis

- **Time Complexity:** O(N * L) per sum, where N is stored keys and L prefix length; O(1) per insert.
- **Space Complexity:** O(N * L) for the map.

## Implementation

```python
from typing import List
class Solution:
    def runMapSum(self, operations: List[str], keys: List[str], vals: List[int]) -> List[int]:
        store = {}
        ans = []
        for op, k, v in zip(operations, keys, vals):
            if op == "insert":
                store[k] = v
            else:
                ans.append(sum(val for key, val in store.items() if key.startswith(k)))
        return ans
```
