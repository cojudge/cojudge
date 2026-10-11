## Approach

Rebuild the search tree from bracket level order using a queue: read values left to right, attaching left and right children to each dequeued parent unless the token is null. Then walk the tree in preorder (node, left, right), collecting values and joining them with commas. Because a search tree's preorder alone can rebuild it, this compact text is sufficient.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is queued once and visited once.
- **Space Complexity:** O(n) for the queue and the output list.

## Implementation

```python
from collections import deque
class Solution:
    def serialize(self, data: str) -> str:
        t = data.strip()
        if t in ("[]", ""):
            return ""
        inner = t[1:-1].strip() if t.startswith("[") else t
        if not inner:
            return ""
        tokens = [p.strip() for p in inner.split(",")]
        if not tokens or tokens[0] in ("null", "None"):
            return ""
        vals = []
        for tok in tokens:
            vals.append(None if tok in ("null", "None") else int(tok))
        if vals[0] is None:
            return ""
        class N:
            def __init__(self, v):
                self.v = v
                self.l = None
                self.r = None
        root = N(vals[0])
        q = deque([root])
        i = 1
        while q and i < len(vals):
            node = q.popleft()
            if i < len(vals) and vals[i] is not None:
                node.l = N(vals[i])
                q.append(node.l)
            i += 1
            if i < len(vals) and vals[i] is not None:
                node.r = N(vals[i])
                q.append(node.r)
            i += 1
        out = []
        def pre(n):
            if not n:
                return
            out.append(str(n.v))
            pre(n.l)
            pre(n.r)
        pre(root)
        return ",".join(out)
```
