## Approach

Treat the cards as doubles and repeatedly pick an ordered pair, replace it by one of its possible results (+, -, *, / when legal), and recurse. With one value left, succeed when it is within 1e-6 of 24. Trying all pairs and orders covers every parenthesization.

## Complexity Analysis

- **Time Complexity:** O(1) — only four numbers, bounded search tree.
- **Space Complexity:** O(1) recursion depth.

## Implementation

```python
from typing import List
class Solution:
    def judgePoint24(self, cards: List[int]) -> bool:
        vals = [float(c) for c in cards]
        def dfs(arr):
            if len(arr) == 1:
                return abs(arr[0] - 24.0) < 1e-6
            for i in range(len(arr)):
                for j in range(len(arr)):
                    if i == j:
                        continue
                    rest = [arr[k] for k in range(len(arr)) if k != i and k != j]
                    a, b = arr[i], arr[j]
                    cands = [a + b, a - b, a * b]
                    if abs(b) > 1e-9:
                        cands.append(a / b)
                    for v in cands:
                        if dfs(rest + [v]):
                            return True
            return False
        return dfs(vals)
```
