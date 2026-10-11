## Approach

The round in which a node falls equals its height: leaves have height 1 and
each parent sits one level above its tallest child. A bottom-up search
computes every height and drops each value into the matching round group.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the node count.
- **Space Complexity:** O(n) for the groups plus recursion depth.

## Implementation

```python
from typing import List

class Solution:
    def findLeaves(self, root) -> List[List[int]]:
        ans: List[List[int]] = []

        def height(node) -> int:
            if node is None:
                return 0
            h = max(height(node.left), height(node.right)) + 1
            if len(ans) < h:
                ans.append([])
            ans[h - 1].append(node.val)
            return h

        height(root)
        return ans
```
