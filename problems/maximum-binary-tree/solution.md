## Approach

Scan the current slice for its maximum and make it the root. The entries left of it and right of it are independent slices, so build each side with the same procedure. An empty slice yields no child. Because values are distinct the result is unique.

## Complexity Analysis

- **Time Complexity:** O(n^2) in the worst case from scanning each slice; O(n log n) average.
- **Space Complexity:** O(n) for recursion depth and the tree itself.

## Implementation

```python
from typing import List
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def constructMaximumBinaryTree(self, nums: List[int]):
        def build(l, r):
            if l > r:
                return None
            m = max(range(l, r + 1), key=lambda i: nums[i])
            node = TreeNode(nums[m])
            node.left = build(l, m - 1)
            node.right = build(m + 1, r)
            return node
        return build(0, len(nums) - 1)
```
