## Approach

Parse the N-ary string breadth-first, then apply left-child right-sibling encoding to reach binary form: the first child becomes the left link and later siblings chain through right links. Decoding walks left once then right repeatedly to rebuild each child list. Serializing the restored N-ary tree canonically closes the round-trip.

## Complexity Analysis

- **Time Complexity:** O(m), where m is the token and node count across parse, encode, decode, and serialize.
- **Space Complexity:** O(m) for the intermediate trees.

## Implementation

```python
from collections import deque
class Solution:
    def encodeDecode(self, data: str) -> str:
        def toks(s):
            s = s.strip()
            if s in ('', '[]'):
                return []
            return [t.strip() for t in s[1:-1].split(',') if t.strip() != '']
        class N:
            def __init__(self, v):
                self.val = int(v)
                self.children = []
        class B:
            def __init__(self, v):
                self.val = v
                self.left = None
                self.right = None
        def parse(s):
            tk = toks(s)
            if not tk or tk[0] == 'null':
                return None
            root = N(tk[0])
            q = deque([root])
            i = 1
            while q and i < len(tk):
                node = q.popleft()
                if tk[i] == 'null':
                    i += 1
                kids = []
                while i < len(tk) and tk[i] != 'null':
                    c = N(tk[i])
                    kids.append(c)
                    q.append(c)
                    i += 1
                node.children = kids
            return root
        def encode(n):
            if not n:
                return None
            b = B(n.val)
            if n.children:
                b.left = encode(n.children[0])
                cur = b.left
                for ch in n.children[1:]:
                    cur.right = encode(ch)
                    cur = cur.right
            return b
        def decode(b):
            if not b:
                return None
            n = N(b.val)
            c = b.left
            while c:
                n.children.append(decode(c))
                c = c.right
            return n
        def serialize(root):
            if not root:
                return '[]'
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
                parts.append('null')
                parts.extend(str(c.val) for c in order[g])
            return '[' + ','.join(parts) + ']'
        return serialize(decode(encode(parse(data))))
```
