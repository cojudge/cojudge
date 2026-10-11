## Approach

Replay the log stream with a stack of active function ids and a cursor marking the last processed timestamp. A start event first bills the idle gap to the function on top of the stack, then pushes the new call. An end event bills the inclusive span to the popped call and advances the cursor past that stamp, which naturally pauses outer frames while inner ones run.

## Complexity Analysis

- **Time Complexity:** O(L), where L is the number of log entries.
- **Space Complexity:** O(D) for the nesting stack of depth D.

## Implementation

```python
from typing import List

class Solution:
    def exclusiveTime(self, n: int, logs: List[str]) -> List[int]:
        res = [0] * n
        st = []
        prev = 0
        for log in logs:
            sid, typ, ts = log.split(":")
            i, t = int(sid), int(ts)
            if typ == "start":
                if st:
                    res[st[-1]] += t - prev
                st.append(i)
                prev = t
            else:
                res[st.pop()] += t - prev + 1
                prev = t + 1
        return res
```
