## Approach

Keep a value grid plus a formula table keyed by cell. Setting writes the value and drops any formula; getting evaluates the stored token list on demand (recursing through chains); summing records the token list then evaluates it. Each token is either a single cell reference decoded from letters-plus-digits or a colon rectangle expanded into its inclusive rows and columns. Because evaluation is lazy, later writes are automatically reflected on the next read.

## Complexity Analysis

- **Time Complexity:** O(q * R * C) in the worst case, where q is the operation count and R*C bounds rectangle expansion.
- **Space Complexity:** O(H * W + F) for the grid plus stored formulas.

## Implementation

```python
from typing import List
class Solution:
    def runExcel(self, operations: List[str], args: List[List[str]]) -> List[int]:
        vals = {}
        formulas = {}
        H = W = 0
        def parse(cell):
            i = 0
            while i < len(cell) and cell[i].isalpha():
                i += 1
            col_s, row_s = cell[:i].upper(), cell[i:]
            c = 0
            for ch in col_s:
                c = c * 26 + (ord(ch) - ord('A') + 1)
            return int(row_s), c
        def get(r, c):
            key = (r, c)
            if key not in formulas:
                return vals.get(key, 0)
            s = 0
            for t in formulas[key]:
                s += ev(t)
            return s
        def ev(t):
            if ":" in t:
                a, b = t.split(":")
                r1, c1 = parse(a)
                r2, c2 = parse(b)
                s = 0
                for r in range(min(r1, r2), max(r1, r2) + 1):
                    for c in range(min(c1, c2), max(c1, c2) + 1):
                        s += get(r, c)
                return s
            r, c = parse(t)
            return get(r, c)
        out = []
        for op, a in zip(operations, args):
            if op == "Excel":
                H, W = int(a[0]), int(a[1])
                vals, formulas = {}, {}
            elif op == "set":
                r, c, v = int(a[0]), int(a[1]), int(a[2])
                formulas.pop((r, c), None)
                vals[(r, c)] = v
            elif op == "get":
                out.append(get(int(a[0]), int(a[1])))
            elif op == "sum":
                r, c = int(a[0]), int(a[1])
                formulas[(r, c)] = list(a[2:])
                out.append(get(r, c))
        return out
```
