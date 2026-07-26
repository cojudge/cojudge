## Approach

The portable input already describes every node by its value and random target index. Build a new outer list and copy each row so the result has the same structure without sharing mutable rows with the input.

## Complexity Analysis

- **Time Complexity:** O(n), where `n` is the number of serialized nodes.
- **Space Complexity:** O(n) for the copied output.

## Implementation

```python
from typing import List

class Solution:
    def copyRandomList(self, nodes: List[List[int]]) -> List[List[int]]:
        return [row[:] for row in nodes]
```
