## Approach

Enumerate all 24 ways to assign the four positions to the four digits. Each assignment splits into an hour and a minute; keep it when the hour is under 24 and the minute under 60. Track the valid assignment with the most minutes since midnight and format it as HH:MM, defaulting to empty when nothing is valid.

## Complexity Analysis

- **Time Complexity:** O(1), a fixed 24 checks.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def largestTimeFromDigits(self, arr: List[int]) -> str:
        best = ""
        best_min = -1
        for i in range(4):
            for j in range(4):
                if j == i:
                    continue
                for k in range(4):
                    if k == i or k == j:
                        continue
                    l = 6 - i - j - k
                    hh = arr[i] * 10 + arr[j]
                    mm = arr[k] * 10 + arr[l]
                    if hh < 24 and mm < 60:
                        tot = hh * 60 + mm
                        if tot > best_min:
                            best_min = tot
                            best = "%02d:%02d" % (hh, mm)
        return best
```
