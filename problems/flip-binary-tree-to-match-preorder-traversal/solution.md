## Approach

Keep a position pointer into the voyage array and walk the tree in preorder. Each visited node must match the current voyage entry, otherwise the voyage is unreachable. When the left child exists but its value differs from the next voyage entry, record a flip at the current node and visit the right subtree first; otherwise visit left first. A single depth-first pass implements this rule.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited once.
- **Space Complexity:** O(h) for recursion depth, where h is the tree height, plus O(n) for the flip list in the worst case.

## Implementation

```python
from typing import List
class Solution:
    def flipMatchVoyage(self, root, voyage: List[int]) -> List[int]:
        self.i = 0
        self.flips = []
        def dfs(node):
            if not node:
                return True
            if self.i >= len(voyage) or node.val != voyage[self.i]:
                return False
            self.i += 1
            left = node.left
            if left is not None and self.i < len(voyage) and left.val != voyage[self.i]:
                self.flips.append(node.val)
                if not dfs(node.right):
                    return False
                if not dfs(node.left):
                    return False
            else:
                if not dfs(node.left):
                    return False
                if not dfs(node.right):
                    return False
            return True
        if not dfs(root):
            return [-1]
        return self.flips
```
