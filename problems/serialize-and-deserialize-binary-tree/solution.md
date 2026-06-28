## Approach

Use BFS level-order traversal to serialize the tree into a string with null placeholders, then deserialize by rebuilding nodes level by level from the same format.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

## Implementation

```python
from typing import Optional
class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        if not root:
            return '[]'
        res = []
        q = [root]
        while q:
            node = q.pop(0)
            if node:
                res.append(str(node.val))
                q.append(node.left)
                q.append(node.right)
            else:
                res.append('null')
        while res and res[-1] == 'null':
            res.pop()
        return '[' + ','.join(res) + ']'
    def deserialize(self, data: str) -> Optional[TreeNode]:
        if data == '[]':
            return None
        vals = data[1:-1].split(',')
        root = TreeNode(int(vals[0]))
        q = [root]
        i = 1
        while q and i < len(vals):
            node = q.pop(0)
            if vals[i] != 'null':
                node.left = TreeNode(int(vals[i]))
                q.append(node.left)
            i += 1
            if i < len(vals) and vals[i] != 'null':
                node.right = TreeNode(int(vals[i]))
                q.append(node.right)
            i += 1
        return root
class Solution:
    def solve(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        ser = Codec()
        deser = Codec()
        return deser.deserialize(ser.serialize(root))
```
