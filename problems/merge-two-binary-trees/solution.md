## Approach

Recurse on node pairs. Empty on both sides yields empty; empty on one side yields a copy of the other side; otherwise create a node holding the summed value whose left is the merge of the left pair and whose right is the merge of the right pair. Copying rather than mutating keeps the inputs intact for the checker.

## Complexity Analysis

- **Time Complexity:** O(m), where m is the total nodes across both trees (each pair visited once).
- **Space Complexity:** O(m) for the new tree plus recursion depth.

## Implementation

```python
class Solution:
    def mergeTrees(self, root1, root2):
        if root1 is None:
            return root2
        if root2 is None:
            return root1
        root1.val += root2.val
        root1.left = self.mergeTrees(root1.left, root2.left)
        root1.right = self.mergeTrees(root1.right, root2.right)
        return root1
```
