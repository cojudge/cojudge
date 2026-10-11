## Approach

Exploit the search-tree ordering instead of scanning everything. Starting at the root, compare the wanted value with the current node: equality returns the current subtree, a smaller value continues left, and a larger value continues right. Falling off the tree means the value is absent.

## Complexity Analysis

- **Time Complexity:** O(h), where h is the tree height (O(log n) when balanced).
- **Space Complexity:** O(1) iterative, O(h) recursive.

## Implementation

```python
class Solution:
    def searchBST(self, root, val: int):
        cur = root
        while cur:
            if val == cur.val:
                return cur
            cur = cur.left if val < cur.val else cur.right
        return None
```
