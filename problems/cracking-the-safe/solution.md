## Approach

Treat every string of n-1 digits as a graph node with k outgoing edges, one per next digit. Walking each edge exactly once (an Euler circuit) lists every n-digit code once. A depth-first search that appends digits in post-order builds such a circuit; appending the start node gives the full answer of length k^n + n - 1.

## Complexity Analysis

- **Time Complexity:** O(k^n), proportional to the number of codes visited once each.
- **Space Complexity:** O(k^n) for the seen edge set plus recursion depth.

## Implementation

```python
class Solution:
    def crackSafe(self, n: int, k: int) -> str:
        if n == 1:
            return ''.join(str(i) for i in range(k))
        start = '0' * (n - 1)
        seen = set()
        ptr = {}
        node_stack = [start]
        in_stack = [-1]
        circuit = []
        while node_stack:
            node = node_stack[-1]
            i = ptr.get(node, 0)
            if i < k:
                ptr[node] = i + 1
                nei = node + str(i)
                if nei not in seen:
                    seen.add(nei)
                    node_stack.append(nei[1:])
                    in_stack.append(i)
            else:
                node_stack.pop()
                ind = in_stack.pop()
                if ind != -1:
                    circuit.append(str(ind))
        circuit.append(start)
        return ''.join(circuit)
```
