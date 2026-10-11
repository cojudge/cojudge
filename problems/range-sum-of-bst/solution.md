## Approach

Do a pruned depth-first walk. Add the node value when it sits inside `[low, high]`; recurse left only when the node exceeds `low` and right only when it is below `high`. BST ordering guarantees skipped subtrees cannot contain answers.

## Complexity Analysis

- **Time Complexity:** O(n) worst case, O(k + log n) on balanced trees where k is the number of hits.
- **Space Complexity:** O(h) for recursion depth, where h is the tree height.

## Implementation

```python
class Solution:
    def rangeSumBST(self, root, low: int, high: int) -> int:
        if not root:
            return 0
        s = root.val if low <= root.val <= high else 0
        if root.val > low:
            s += self.rangeSumBST(root.left, low, high)
        if root.val < high:
            s += self.rangeSumBST(root.right, low, high)
        return s
```
