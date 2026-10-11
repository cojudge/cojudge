## Approach

Tokenize the bracket string and reconstruct the N-ary tree level by level: after the root, every `null` token ends the current child group and the values that follow become the next queued node's children. A depth-first walk then returns one plus the deepest child depth, with leaves yielding one and a missing root yielding zero.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of tokens.
- **Space Complexity:** O(n) for the rebuilt tree and the queue.

## Implementation

```python
from collections import deque

class Solution:
    def maxDepth(self, data: str) -> int:
        t = data.strip()
        if t in ("", "[]"):
            return 0
        toks = [p.strip() for p in t[1:-1].split(",") if p.strip()]
        if not toks or toks[0] == "null":
            return 0
        nodes = [int(toks[0])]
        children_of = {0: []}
        q = deque([0])
        nodes = [int(toks[0])]
        i = 1
        while q and i < len(toks):
            u = q.popleft()
            if i < len(toks) and toks[i] == "null":
                i += 1
            while i < len(toks) and toks[i] != "null":
                nodes.append(int(toks[i]))
                v = len(nodes) - 1
                children_of.setdefault(u, []).append(v)
                children_of.setdefault(v, [])
                q.append(v)
                i += 1
        def depth(u):
            best = 0
            for v in children_of.get(u, []):
                best = max(best, depth(v))
            return 1 + best
        return depth(0)
```
