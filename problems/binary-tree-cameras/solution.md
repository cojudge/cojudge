## Approach

Root the decisions greedily from the leaves upward. Each subtree reports one of three states: needs coverage from its parent, is already covered, or hosts a camera. A node with an uncovered child must host a camera; a node with a camera-child is covered; otherwise it asks its parent for coverage. The root gets a camera if it still needs one. Placing cameras as low as possible never harms optimality.

## Complexity Analysis

- **Time Complexity:** O(n) for n nodes in one post-order pass.
- **Space Complexity:** O(h) recursion depth for height h.

## Implementation

```python
class Solution:
    def minCameraCover(self, root) -> int:
        ans = 0

        def dfs(nd):
            nonlocal ans
            if nd is None:
                return 1
            l, r = dfs(nd.left), dfs(nd.right)
            if l == 0 or r == 0:
                ans += 1
                return 2
            if l == 2 or r == 2:
                return 1
            return 0

        if dfs(root) == 0:
            ans += 1
        return ans
```
