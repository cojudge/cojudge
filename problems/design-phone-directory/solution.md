## Approach

Model the pool with a taken/free flag per number. The constructor marks everything free. `get` linearly scans for the first free slot (recording `-1` when full), `check` reads one flag as `1`/`0`, and `release` clears a taken flag. Only `get` and `check` append to the answer.

## Complexity Analysis

- **Time Complexity:** O(m * maxNumbers) worst case for m operations due to the linear `get` scan.
- **Space Complexity:** O(maxNumbers) for the flags plus O(m) for the collected answers.

## Implementation

```python
from typing import List
class Solution:
    def runPhoneDirectory(self, operations: List[str], args: List[List[int]]) -> List[int]:
        max_n = args[0][0]
        taken = [False] * max_n
        out = []
        for i in range(1, len(operations)):
            op = operations[i]
            if op == "get":
                idx = -1
                for j in range(max_n):
                    if not taken[j]:
                        idx = j
                        break
                if idx != -1:
                    taken[idx] = True
                out.append(idx)
            elif op == "check":
                out.append(0 if taken[args[i][0]] else 1)
            elif op == "release":
                if taken[args[i][0]]:
                    taken[args[i][0]] = False
        return out
```
