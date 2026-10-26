## Approach

Parse the N-ary string breadth-first, then apply left-child right-sibling encoding to reach binary form: the first child becomes the left link and later siblings chain through right links. Emit the binary tree in level order with `null` placeholders (trailing nulls trimmed). Decoding parses that binary text, walks left once then right repeatedly to rebuild each child list, and serializes the restored N-ary tree canonically.

## Complexity Analysis

- **Time Complexity:** O(m), where m is the token and node count across parse, encode, decode, and serialize.
- **Space Complexity:** O(m) for the intermediate trees.

## Implementation

```python
from collections import deque
class Codec:
    def _toks(self, s):
        s = (s or "").strip()
        if s in ("", "[]"):
            return []
        inner = s[1:-1] if s.startswith("[") else s
        return [t.strip() for t in inner.split(",") if t.strip() != ""]
    def _parse_nary(self, data):
        toks = self._toks(data)
        if not toks or toks[0] == "null":
            return None
        class N:
            def __init__(self, v):
                self.val = int(v)
                self.children = []
        root = N(toks[0])
        q = deque([root])
        i = 1
        while q and i < len(toks):
            node = q.popleft()
            if toks[i] == "null":
                i += 1
            kids = []
            while i < len(toks) and toks[i] != "null":
                c = N(toks[i])
                kids.append(c)
                q.append(c)
                i += 1
            node.children = kids
        return root
    def _parse_binary(self, data):
        toks = self._toks(data)
        if not toks or toks[0] == "null":
            return None
        class B:
            def __init__(self, v):
                self.val = int(v)
                self.left = None
                self.right = None
        root = B(toks[0])
        q = deque([root])
        i = 1
        while q and i < len(toks):
            node = q.popleft()
            if toks[i] != "null":
                node.left = B(toks[i])
                q.append(node.left)
            i += 1
            if i < len(toks) and toks[i] != "null":
                node.right = B(toks[i])
                q.append(node.right)
            i += 1
        return root
    def _encode(self, n):
        if n is None:
            return None
        class B:
            def __init__(self, v):
                self.val = v
                self.left = None
                self.right = None
        b = B(n.val)
        if n.children:
            b.left = self._encode(n.children[0])
            cur = b.left
            for ch in n.children[1:]:
                cur.right = self._encode(ch)
                cur = cur.right
        return b
    def _decode(self, b):
        if b is None:
            return None
        class N:
            def __init__(self, v):
                self.val = v
                self.children = []
        n = N(b.val)
        c = b.left
        while c is not None:
            n.children.append(self._decode(c))
            c = c.right
        return n
    def _ser_binary(self, root):
        if root is None:
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
    def _ser_nary(self, root):
        if root is None:
            return "[]"
        order = []
        q = deque([root])
        while q:
            n = q.popleft()
            order.append(n.children)
            q.extend(n.children)
        last = len(order) - 1
        while last >= 0 and not order[last]:
            last -= 1
        parts = [str(root.val)]
        for g in range(last + 1):
            parts.append("null")
            parts.extend(str(c.val) for c in order[g])
        return "[" + ",".join(parts) + "]"
    def encode(self, naryData):
        return self._ser_binary(self._encode(self._parse_nary(naryData)))
    def decode(self, binaryData):
        return self._ser_nary(self._decode(self._parse_binary(binaryData)))
```
