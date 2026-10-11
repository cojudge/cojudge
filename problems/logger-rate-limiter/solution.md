## Approach

Track the most recent printed timestamp for each distinct message in a hash
map. A request prints when the message is new or the gap since its stored
time reaches 10 seconds; only printed requests refresh the stored time.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of requests.
- **Space Complexity:** O(m) for m distinct messages.

## Implementation

```python
from typing import List

class Solution:
    def runLogger(self, timestamps: List[int], messages: List[str]) -> List[int]:
        last = {}
        ans = []
        for t, m in zip(timestamps, messages):
            if m not in last or t - last[m] >= 10:
                ans.append(1)
                last[m] = t
            else:
                ans.append(0)
        return ans
```
