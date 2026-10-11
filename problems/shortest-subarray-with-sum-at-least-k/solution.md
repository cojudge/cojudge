## Approach

Build prefix sums so any segment sum is a difference of two prefixes. Scan the prefixes while storing promising start indices in a deque kept increasing in prefix value. For each end position, shrink from the front whenever the window already reaches `k` to capture the shortest valid length, then drop larger prefixes from the back because they can never beat the current one.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length. Each index enters and leaves the deque once.
- **Space Complexity:** O(n) for the prefix array and deque.

## Implementation

```python
from collections import deque
from typing import List

class Solution:
    def shortestSubarray(self, nums: List[int], k: int) -> int:
        n = len(nums)
        pref = [0] * (n + 1)
        for i, v in enumerate(nums):
            pref[i + 1] = pref[i] + v
        dq = deque()
        best = float('inf')
        for i in range(n + 1):
            while dq and pref[i] - pref[dq[0]] >= k:
                best = min(best, i - dq.popleft())
            while dq and pref[dq[-1]] >= pref[i]:
                dq.pop()
            dq.append(i)
        return -1 if best == float('inf') else best
```
