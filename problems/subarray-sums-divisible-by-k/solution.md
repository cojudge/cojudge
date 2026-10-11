## Approach

Scan the array while maintaining the running total modulo k. Two prefix positions with equal remainders enclose a slice whose sum is a multiple of k. Normalizing each remainder into 0..k-1 handles negatives. A hash map counts how often each remainder has occurred; the current prefix contributes that many new qualifying slices ending here.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of nums. Each element updates one map entry.
- **Space Complexity:** O(k) for the remainder frequency table.

## Implementation

```python
from typing import List
class Solution:
    def subarraysDivByK(self, nums: List[int], k: int) -> int:
        freq = {0: 1}
        pref = 0
        ans = 0
        for x in nums:
            pref = (pref + x) % k
            ans += freq.get(pref, 0)
            freq[pref] = freq.get(pref, 0) + 1
        return ans
```
