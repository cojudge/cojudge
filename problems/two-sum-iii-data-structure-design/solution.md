## Approach

Replay the session while keeping a frequency table of added numbers. Adding increments a count; finding scans stored keys for a complement that sums to the target, insisting on two copies when both addends are equal. Each find answer is encoded as 1 (yes) or 0 (no), and only find steps produce output.

## Complexity Analysis

- **Time Complexity:** O(n) per add, O(d) per find where d is the number of distinct stored values.
- **Space Complexity:** O(d) for the frequency table.

## Implementation

```python
from typing import List
class Solution:
    def runTwoSum(self, operations: List[str], values: List[int]) -> List[int]:
        from collections import defaultdict
        counts = defaultdict(int)
        ans = []
        for op, v in zip(operations, values):
            if op == "add":
                counts[v] += 1
            elif op == "find":
                ok = False
                for x, c in counts.items():
                    need = v - x
                    if need == x:
                        if c >= 2:
                            ok = True
                            break
                    elif need in counts:
                        ok = True
                        break
                ans.append(1 if ok else 0)
        return ans
```
