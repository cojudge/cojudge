## Approach

Brute force over the tiny search space: for each hour 0..11 and minute 0..59, add the binary popcounts of the two values. Keep the pair when the sum equals `turnedOn`, formatting minutes with a leading zero when needed. Exhausting 720 pairs is trivial and cannot miss a reading.

## Complexity Analysis

- **Time Complexity:** O(1), a fixed 12 * 60 enumeration.
- **Space Complexity:** O(1) besides the output.

## Implementation

```python
from typing import List

class Solution:
    def readBinaryWatch(self, turnedOn: int) -> List[str]:
        res = []
        for h in range(12):
            for m in range(60):
                if bin(h).count('1') + bin(m).count('1') == turnedOn:
                    res.append(f"{h}:{m:02d}")
        return res
```
