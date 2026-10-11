## Approach

Total the tree. A single cut can only work when the total is even, splitting into two halves of `total / 2`. A post-order walk computes every branch sum; if any proper branch (anything but the whole tree) hits the half value, the answer is true.

## Complexity Analysis

- **Time Complexity:** O(n) across two walks.
- **Space Complexity:** O(h) recursion depth.

## Implementation

```python
class Solution:
    def checkEqualTree(self, root) -> bool:
        def total(n):
            if not n:
                return 0
            return n.val + total(n.left) + total(n.right)
        s = total(root)
        if s % 2 != 0:
            return False
        self.ok = False
        def dfs(n):
            if not n:
                return 0
            cur = n.val + dfs(n.left) + dfs(n.right)
            if n is not root and cur == s // 2:
                self.ok = True
            return cur
        dfs(root)
        return self.ok
```
