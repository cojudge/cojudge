## Approach

Do a depth-first walk carrying the running sum from the root. A hash map counts how often each prefix sum has appeared on the current path; any earlier prefix equal to `current - targetSum` closes a qualifying downward path ending here. Add that count, recurse into both children, then decrement the current prefix before backtracking.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the node count. Each node is visited once with O(1) map work.
- **Space Complexity:** O(h) for recursion depth plus the prefix table, where h is the tree height.

## Implementation

```python
from collections import defaultdict
class Solution:
    def pathSum(self, root, targetSum: int) -> int:
        freq = defaultdict(int)
        freq[0] = 1
        def dfs(n, cur):
            if not n:
                return 0
            cur += n.val
            res = freq[cur - targetSum]
            freq[cur] += 1
            res += dfs(n.left, cur)
            res += dfs(n.right, cur)
            freq[cur] -= 1
            return res
        return dfs(root, 0)
```
