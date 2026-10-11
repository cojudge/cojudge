## Approach

Walk the tree once in inorder order to collect values from smallest to largest, then serve the operation list with a position pointer. A next step returns the value at the pointer and advances it; a hasNext step reports 1 while the pointer is inside the list and 0 otherwise. This mirrors a controlled inorder iterator without lazy stack handling.

## Complexity Analysis

- **Time Complexity:** O(n) for the one inorder walk, plus O(1) per operation.
- **Space Complexity:** O(n) for the flattened values.

## Implementation

```python
from typing import List
class Solution:
    def runBstIterator(self, root, operations: List[str]) -> List[int]:
        order = []
        def dfs(node):
            if not node:
                return
            dfs(node.left)
            order.append(node.val)
            dfs(node.right)
        dfs(root)
        ans = []
        idx = 0
        for op in operations:
            if op == "next":
                ans.append(order[idx])
                idx += 1
            elif op == "hasNext":
                ans.append(1 if idx < len(order) else 0)
        return ans
```
