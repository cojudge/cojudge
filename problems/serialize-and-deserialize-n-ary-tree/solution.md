## Approach

Split the bracket text on commas and treat `null` as the start of the next node's child group. Rebuild the tree breadth-first with a queue: each dequeued node consumes one group. To serialize, walk nodes in the same breadth order and emit each child group prefixed by `null`, dropping trailing empty groups. Parsing then serializing twice yields a stable canonical string.

## Complexity Analysis

- **Time Complexity:** O(m), where m is the number of tokens in the encoding.
- **Space Complexity:** O(m) for the token list and the rebuilt tree.

## Implementation

```python
from collections import deque
class Solution:
    def codecRoundTrip(self, data: str) -> str:
        def tokens(s):
            s = s.strip()
            if s in ('', '[]'):
                return []
            inner = s[1:-1]
            return [t.strip() for t in inner.split(',') if t.strip() != '']
        def parse(s):
            toks = tokens(s)
            if not toks:
                return None
            if toks[0] in ('null', 'None'):
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
                if i < len(toks) and toks[i] == 'null':
                    i += 1
                kids = []
                while i < len(toks) and toks[i] != 'null':
                    c = N(toks[i])
                    kids.append(c)
                    q.append(c)
                    i += 1
                node.children = kids
            return root
        def serialize(root):
            if root is None:
                return '[]'
            order = []
            q = deque([root])
            while q:
                n = q.popleft()
                order.append(n.children)
                for c in n.children:
                    q.append(c)
            last = len(order) - 1
            while last >= 0 and not order[last]:
                last -= 1
            parts = [str(root.val)]
            for g in range(last + 1):
                parts.append('null')
                for c in order[g]:
                    parts.append(str(c.val))
            return '[' + ','.join(parts) + ']'
        r1 = parse(data)
        s1 = serialize(r1)
        return serialize(parse(s1))
```
