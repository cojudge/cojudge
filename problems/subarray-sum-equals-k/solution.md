## Approach

Track running prefix sums and their frequencies in a hash map. For each prefix `s`, the number of subarrays ending here with sum `k` equals the frequency of `s - k` seen so far. Start with `{0: 1}` to count subarrays from index 0.

## Complexity Analysis

- **Time Complexity:** O(n), single pass over `nums` with O(1) average map operations.
- **Space Complexity:** O(n) for prefix frequencies in the worst case.

## Implementation

```python
from typing import List
class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        from collections import defaultdict
        freq = defaultdict(int)
        freq[0] = 1
        pref = ans = 0
        for x in nums:
            pref += x
            ans += freq[pref - k]
            freq[pref] += 1
        return ans
```
