## Approach

Parse the encoding into a small tree where each node is either an integer or a
list of children. One walk records the deepest integer depth, and a second
walk adds `value * (maxDepth - depth + 1)` for every integer. Empty lists
contribute nothing.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the encoding length.
- **Space Complexity:** O(n) for the parse tree and recursion.

## Implementation

```python
from typing import Union

class Solution:
    def depthSumInverse(self, nestedList: str) -> int:
        pos = 0
        s = nestedList

        def parse():
            nonlocal pos
            if s[pos] == "[":
                pos += 1
                items = []
                while s[pos] != "]":
                    if s[pos] == ",":
                        pos += 1
                        continue
                    items.append(parse())
                pos += 1
                return items
            j = pos
            if s[j] == "-":
                j += 1
            while j < len(s) and s[j].isdigit():
                j += 1
            val = int(s[pos:j])
            pos = j
            return val

        def max_depth(node, d: int) -> int:
            if isinstance(node, int):
                return d
            best = d
            for c in node:
                best = max(best, max_depth(c, d + 1))
            return best

        def total(node, d: int, m: int) -> int:
            if isinstance(node, int):
                return node * (m - d + 1)
            return sum(total(c, d + 1, m) for c in node)

        root = parse()
        m = max_depth(root, 0)
        return total(root, 0, m)
```
