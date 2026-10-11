## Approach

Recursively build all BSTs for each interval: every value in range serves once as root, pairing each left result with each right result. The empty interval contributes one null so leaves attach correctly. Each finished tree is encoded with breadth-first serialization (null placeholders, trailing nulls removed), and the collection is returned for set comparison.

## Complexity Analysis

- **Time Complexity:** O(Catalan(n) * n) to build and serialize all trees.
- **Space Complexity:** O(Catalan(n) * n) for the stored trees and strings.

## Implementation

```python
from typing import List
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def generateTrees(self, n: int) -> List[str]:
        if n == 0:
            return []
        def build(start: int, end: int):
            if start > end:
                return [None]
            res = []
            for r in range(start, end + 1):
                for l in build(start, r - 1):
                    for rt in build(r + 1, end):
                        res.append(TreeNode(r, l, rt))
            return res
        def serialize(root) -> str:
            if root is None:
                return "[]"
            out = []
            q = [root]
            while q:
                node = q.pop(0)
                if node is None:
                    out.append("null")
                else:
                    out.append(str(node.val))
                    q.append(node.left)
                    q.append(node.right)
            while out and out[-1] == "null":
                out.pop()
            return "[" + ",".join(out) + "]"
        return [serialize(t) for t in build(1, n)]
```
