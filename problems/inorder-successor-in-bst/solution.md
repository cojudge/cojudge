## Approach

Search the BST for p while tracking the best successor candidate: whenever the current node exceeds p, it could be the answer so record it and go left; otherwise go right. The last recorded value is the smallest key larger than p.

## Complexity Analysis

- **Time Complexity:** O(h) where h is tree height.
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def inorderSuccessor(self, root, p: int) -> int:
        succ = -1
        cur = root
        while cur:
            if p < cur.val:
                succ = cur.val
                cur = cur.left
            else:
                cur = cur.right
        return succ
```
