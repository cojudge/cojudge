## Approach

Walk down the left spine keeping the parent and the parent's right sibling. At each node, save its left and right children, then point its left to the previous right sibling and its right to the parent. Advance all pointers one step left; the last visited node is the new root.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each spine node is rewired once.
- **Space Complexity:** O(1) extra for the iterative walk (O(h) if done recursively).

## Implementation

```python
class Solution:
    def upsideDownBinaryTree(self, root):
        curr, prev, prev_right = root, None, None
        while curr:
            nxt = curr.left
            right = curr.right
            curr.left = prev_right
            curr.right = prev
            prev = curr
            prev_right = right
            curr = nxt
        return prev
```
