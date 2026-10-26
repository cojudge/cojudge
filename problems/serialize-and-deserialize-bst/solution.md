## Approach

Reuse the classic binary-tree codec: serialize with breadth-first order (or preorder — either round-trips), and rebuild with a queue. A search tree's preorder alone would also suffice, but the plain BFS scheme needs no ordering assumption and works for every test shape.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is queued once and visited once.
- **Space Complexity:** O(n) for the queue and the output string.

## Implementation

```python
from collections import deque
class Codec:
    def serialize(self, root):
        if not root:
            return "[]"
        out = []
        q = deque([root])
        while q:
            node = q.popleft()
            if node is None:
                out.append("null")
            else:
                out.append(str(node.val))
                q.append(node.left)
                q.append(node.right)
        while out and out[-1] == "null":
            out.pop()
        return "[" + ",".join(out) + "]"
    def deserialize(self, data):
        s = (data or "").strip()
        if s in ("", "[]"):
            return None
        inner = s[1:-1] if s.startswith("[") else s
        toks = [t.strip() for t in inner.split(",") if t.strip() != ""]
        if not toks or toks[0] in ("null", "None"):
            return None
        class N:
            def __init__(self, v):
                self.val = int(v)
                self.left = None
                self.right = None
        root = N(toks[0])
        q = deque([root])
        i = 1
        while q and i < len(toks):
            node = q.popleft()
            if toks[i] not in ("null", "None"):
                node.left = N(toks[i])
                q.append(node.left)
            i += 1
            if i < len(toks) and toks[i] not in ("null", "None"):
                node.right = N(toks[i])
                q.append(node.right)
            i += 1
        return root
```
