## Approach

Traverse the tree one level at a time. Visit right children before left children, so the first node removed at each level is the one visible from the right side. Record that first value and enqueue the next level.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(w), where `w` is the maximum tree width, excluding the output.

## Implementation

```python
from collections import deque
from typing import List

class Solution:
    def rightSideView(self, root) -> List[int]:
        if root is None:
            return []

        queue = deque([root])
        visible = []
        while queue:
            for index in range(len(queue)):
                node = queue.popleft()
                if index == 0:
                    visible.append(node.val)
                if node.right is not None:
                    queue.append(node.right)
                if node.left is not None:
                    queue.append(node.left)
        return visible
```
