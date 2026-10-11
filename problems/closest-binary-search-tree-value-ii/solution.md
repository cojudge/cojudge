## Approach

Parse the decimal target string into a double and collect all tree values with an inorder walk. Sort the values by absolute distance to the target, breaking ties by the smaller value, and return the first k. The checker accepts any order of a valid k-set by comparing the largest distance inside the answer against the smallest distance outside it.

## Complexity Analysis

- **Time Complexity:** O(n log n), where n is the number of nodes, for sorting by distance.
- **Space Complexity:** O(n) for the collected values.

## Implementation

```python
class Solution:
    def closestKValues(self, root, target: str, k: int) -> list[int]:
        t = float(target)
        vals: list[int] = []
        def inorder(node) -> None:
            if node is None:
                return
            inorder(node.left)
            vals.append(node.val)
            inorder(node.right)
        inorder(root)
        vals.sort(key=lambda v: (abs(v - t), v))
        return vals[:k]
```
