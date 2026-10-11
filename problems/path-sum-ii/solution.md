## Approach

Backtracking depth-first search keeps one mutable path from the root to the current node. Each step appends the node value; at a leaf the accumulated path is copied to the answer when its sum equals the target. Removing the value on the way back up restores the path for sibling branches. Copying only at leaves keeps memory proportional to depth plus output size.

## Complexity Analysis

- **Time Complexity:** O(n * h) in the worst case — each root-to-leaf path of length h may be copied.
- **Space Complexity:** O(h) recursion depth excluding the answer.

## Implementation

```python
from typing import List
class Solution:
    def pathSum(self, root, targetSum: int) -> List[List[int]]:
        ans = []
        path = []
        def dfs(n, rest):
            if not n:
                return
            path.append(n.val)
            if not n.left and not n.right:
                if n.val == rest:
                    ans.append(list(path))
            else:
                dfs(n.left, rest - n.val)
                dfs(n.right, rest - n.val)
            path.pop()
        dfs(root, targetSum)
        return ans
```
