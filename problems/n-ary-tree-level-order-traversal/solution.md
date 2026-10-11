## Approach

Decode the string into an N-ary tree by scanning comma-separated tokens and assigning each `null`-delimited group to the next queued node. Then traverse breadth-first, cutting the queue into levels so each depth's values land together.

## Complexity Analysis

- **Time Complexity:** O(m), where m is the token count plus node count.
- **Space Complexity:** O(m) for tokens, the tree, and the queue.

## Implementation

```python
from collections import deque
class Solution:
    def levelOrder(self, data: str):
        s = data.strip()
        if s in ('', '[]'):
            return []
        toks = [t.strip() for t in s[1:-1].split(',') if t.strip() != '']
        if not toks or toks[0] == 'null':
            return []
        class N:
            def __init__(self, v):
                self.val = int(v)
                self.children = []
        root = N(toks[0])
        q = deque([root])
        i = 1
        while q and i < len(toks):
            node = q.popleft()
            if i < len(toks) and toks[i] == 'null':
                i += 1
            kids = []
            while i < len(toks) and toks[i] != 'null':
                c = N(toks[i])
                kids.append(c)
                q.append(c)
                i += 1
            node.children = kids
        ans = []
        q = deque([root])
        while q:
            level = []
            for _ in range(len(q)):
                n = q.popleft()
                level.append(n.val)
                q.extend(n.children)
            ans.append(level)
        return ans
```
