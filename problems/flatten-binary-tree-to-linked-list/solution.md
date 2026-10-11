## Approach

A preorder walk lists the exact order the final chain must follow. Rebuilding a chain of right-only nodes from that list is straightforward: each new node takes the next preorder value with an empty left pointer. This uses extra nodes but keeps the logic clear; an in-place splice achieves the same order without allocation.

## Complexity Analysis

- **Time Complexity:** O(n), one preorder pass plus one chain build.
- **Space Complexity:** O(n) for the value list (O(h) with an in-place splice).

## Implementation

```python
class Solution:
    def flatten(self, root):
        if not root:
            return None
        vals = []
        def pre(n):
            if not n:
                return
            vals.append(n.val)
            pre(n.left)
            pre(n.right)
        pre(root)
        root.val = vals[0]
        root.left = None
        cur = root
        for v in vals[1:]:
            cur.right = TreeNode(v)
            cur = cur.right
            cur.left = None
        return root
```
