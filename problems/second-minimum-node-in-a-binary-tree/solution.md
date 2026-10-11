## Approach

The root stores the minimum. Traverse the whole tree and keep the smallest value that is strictly greater than the root value. A stack or queue walk suffices; if no such value appears, answer `-1`.

## Complexity Analysis

- **Time Complexity:** O(n), one visit per node.
- **Space Complexity:** O(h) for the traversal stack.

## Implementation

```python
class Solution:
    def findSecondMinimumValue(self, root) -> int:
        first = root.val
        second = float("inf")
        stack = [root]
        while stack:
            n = stack.pop()
            if not n:
                continue
            if first < n.val < second:
                second = n.val
            if n.left:
                stack.append(n.left)
            if n.right:
                stack.append(n.right)
        return -1 if second == float("inf") else second
```
