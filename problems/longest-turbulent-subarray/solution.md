## Approach

A subarray is turbulent when adjacent comparison signs alternate. Maintain two counters: `inc` (the longest turbulent subarray ending with an increasing step) and `dec` (the longest one ending with a decreasing step). For each adjacent pair, either extend the run in the opposite direction, or restart the run when the pair is equal. Track the maximum over all runs.

## Complexity Analysis

- **Time Complexity:** O(n), where `n` is `arr.length`.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def maxTurbulenceSize(self, arr: List[int]) -> int:
        n = len(arr)
        if n < 2:
            return n
        inc = dec = 1
        best = 1
        for i in range(1, n):
            if arr[i - 1] < arr[i]:
                inc = dec + 1
                dec = 1
            elif arr[i - 1] > arr[i]:
                dec = inc + 1
                inc = 1
            else:
                inc = dec = 1
            best = max(best, inc, dec)
        return best
```