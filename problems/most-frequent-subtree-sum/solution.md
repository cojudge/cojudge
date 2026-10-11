## Approach

Compute every subtree total with a post-order traversal: a leaf contributes its own value, and an inner node adds its value to the totals of both children. Record each total in a frequency map while tracking the highest count. A second pass over the map keeps exactly the totals whose count equals that maximum.

## Complexity Analysis

- **Time Complexity:** O(n), one visit per node plus one pass over distinct totals.
- **Space Complexity:** O(n) for recursion depth and the frequency map in the worst case.

## Implementation

```python
from typing import List

class Solution:
    def findFrequentTreeSum(self, root) -> List[int]:
        from collections import Counter
        freq = Counter()

        def dfs(node):
            if node is None:
                return 0
            s = node.val + dfs(node.left) + dfs(node.right)
            freq[s] += 1
            return s

        if root is None:
            return []
        dfs(root)
        best = max(freq.values())
        return [s for s, c in freq.items() if c == best]
```
