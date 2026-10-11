## Approach

Decide the flips greedily from left to right. When position `i` is reached,
every flip that could still cover it except one starting at `i` has already
been fixed, so if the current effective bit is `0` there is no choice but to
start a flip at `i`. Maintain the number of currently active flips with a
running counter: a flip started at `i` stops affecting positions `k` steps
later, which a marker array records. If a needed flip would run past the end
of the array, the task is impossible.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`. Each position is handled once.
- **Space Complexity:** O(n) for the flip-start markers.

## Implementation

```python
from typing import List
class Solution:
    def minKBitFlips(self, nums: List[int], k: int) -> int:
        n = len(nums)
        started = [0] * n
        active = 0
        ans = 0
        for i in range(n):
            if i >= k:
                active -= started[i - k]
            if (nums[i] + active) % 2 == 0:
                if i + k > n:
                    return -1
                started[i] = 1
                active += 1
                ans += 1
        return ans
```
