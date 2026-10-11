## Approach

Do a post-order walk. For each node compute the net surplus of its subtree: coins present minus nodes present, i.e. node.val - 1 plus the surpluses of both children. The absolute surplus of each child must cross the connecting edge, so add those absolute values to the move counter. The root surplus is zero by the problem guarantee, and the counter holds the optimal total because every edge is crossed the minimum necessary times.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited once.
- **Space Complexity:** O(h) for recursion depth, where h is the tree height.

## Implementation

```python
class Solution:
    def distributeCoins(self, root) -> int:
        self.moves = 0
        def bal(node):
            if not node:
                return 0
            l = bal(node.left)
            r = bal(node.right)
            self.moves += abs(l) + abs(r)
            return node.val - 1 + l + r
        bal(root)
        return self.moves
```
