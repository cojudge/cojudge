## Approach

Parse the decimal target string into a double, then walk down the search tree from the root. At each node compare its distance to the target with the best distance seen so far, keeping the smaller value on ties. Move left when the target is smaller and right when it is larger, which visits only one path from root to leaf.

## Complexity Analysis

- **Time Complexity:** O(h), where h is the tree height.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def closestValue(self, root, target: str) -> int:
        t = float(target)
        best = root.val
        best_diff = abs(root.val - t)
        node = root
        while node is not None:
            diff = abs(node.val - t)
            if diff < best_diff - 1e-12 or (abs(diff - best_diff) <= 1e-12 and node.val < best):
                best, best_diff = node.val, diff
            if t < node.val:
                node = node.left
            elif t > node.val:
                node = node.right
            else:
                break
        return best
```
