## Approach

Decode the bracket string into linked N-ary nodes with a queue, then walk depth-first emitting each node only after all of its children have been listed.

## Complexity Analysis

- **Time Complexity:** O(m) for m tokens plus nodes.
- **Space Complexity:** O(m) for the tree and recursion stack.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def postorder(self, data: str) -> List[int]:
        s = data.strip()
        if s in ('', '[]'):
            return []
        toks = [t.strip() for t in s[1:-1].split(',') if t.strip() != '']
        if not toks or toks[0] == 'null':
            return []
        class N:
            def __init__(self, v):
                self.val = int(v); self.children = []
        root = N(toks[0])
        q = deque([root])
        i = 1
        while q and i < len(toks):
            node = q.popleft()
            if i < len(toks) and toks[i] == 'null':
                i += 1
            kids = []
            while i < len(toks) and toks[i] != 'null':
                c = N(toks[i]); kids.append(c); q.append(c); i += 1
            node.children = kids
        ans = []
        def dfs(n):
            for c in n.children:
                dfs(c)
            ans.append(n.val)
        dfs(root)
        return ans
```
