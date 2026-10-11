## Approach

Keep every stored record as an id plus its six timestamp parts. For a retrieve call, cut the stored stamp and both bounds down to the leading components chosen by the granularity, then keep records whose truncated stamp lies between the truncated bounds. Rows are emitted in call order and preserve insertion order.

## Complexity Analysis

- **Time Complexity:** O(P * R) where P is the number of stored records and R the number of retrieve calls.
- **Space Complexity:** O(P + output) for the stored records and answer rows.

## Implementation

```python
from typing import List

class Solution:
    def runLogStorage(self, operations: List[str], values: List[str]) -> List[List[int]]:
        gra = {"Year": 1, "Month": 2, "Day": 3, "Hour": 4, "Minute": 5, "Second": 6}
        logs = []
        out = []
        for op, v in zip(operations, values):
            if op == "LogSystem":
                logs = []
            elif op == "put":
                mid = v.index("|")
                logs.append((int(v[:mid]), [int(x) for x in v[mid+1:].split(":")]))
            elif op == "retrieve":
                s, e, g = v.split("|")
                k = gra[g]
                sp = [int(x) for x in s.split(":")][:k]
                ep = [int(x) for x in e.split(":")][:k]
                row = [i for i, t in logs if sp <= t[:k] <= ep]
                out.append(row)
        return out
```
