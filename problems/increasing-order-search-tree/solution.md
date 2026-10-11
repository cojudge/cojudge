## Approach

An in-order traversal of a search tree yields its keys from smallest to largest. Storing that order and then stitching brand-new nodes together so each node has only a right link produces exactly the requested spine. Building fresh nodes keeps the original tree untouched for the checker.

## Complexity Analysis

- **Time Complexity:** O(n) to visit each node once and O(n) to relink.
- **Space Complexity:** O(n) for the value list and the new chain (plus recursion depth).

## Implementation

```python
class Solution:
    def increasingBST(self, root):
        vals = []
        def dfs(nd):
            if not nd:
                return
            dfs(nd.left)
            vals.append(nd.val)
            dfs(nd.right)
        dfs(root)
        dummy = TreeNode(0)
        cur = dummy
        for v in vals:
            cur.right = TreeNode(v)
            cur = cur.right
        return dummy.right
```
