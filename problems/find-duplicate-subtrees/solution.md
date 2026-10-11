## Approach

Give every branch a preorder code made of its value plus the codes of its children, using `#` for empty spots. Equal branches produce equal codes. Walk the tree bottom-up, count each code in a hash table, and record a code the second time it appears. Sorting the recorded codes makes the answer stable.

## Complexity Analysis

- **Time Complexity:** O(n^2) in the worst case from string building over n nodes, O(n) average with short codes.
- **Space Complexity:** O(n^2) for the stored codes in the worst case.

## Implementation

```python
from typing import List
class Solution:
    def findDuplicateSubtrees(self, root) -> List[str]:
        from collections import defaultdict
        count = defaultdict(int)
        ans = []
        def code(n):
            if not n:
                return "#"
            key = f"{n.val},{code(n.left)},{code(n.right)}"
            count[key] += 1
            if count[key] == 2:
                ans.append(key)
            return key
        code(root)
        return sorted(ans)
```
