## Approach

The middle of a sorted slice is the ideal root: it leaves equal-sized halves for the children, which guarantees balance. Recurse on the left half and right half with the same rule. Each level halves the input, so the recursion depth stays logarithmic.

## Complexity Analysis

- **Time Complexity:** O(n), every entry becomes one node.
- **Space Complexity:** O(log n) recursion depth for balanced output, O(n) for the tree itself.

## Implementation

```python
class Solution:
    def sortedArrayToBST(self, nums):
        def build(l, r):
            if l > r:
                return None
            m = (l + r) // 2
            n = TreeNode(nums[m])
            n.left = build(l, m - 1)
            n.right = build(m + 1, r)
            return n
        return build(0, len(nums) - 1)
```
