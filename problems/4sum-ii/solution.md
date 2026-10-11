## Approach

Pair the first two lists and record how often each pair sum occurs in a hash map. Then pair the last two lists; for each sum `s`, the needed complement `-s` in the map tells how many first-half pairs complete a zero total. Summing over all second-half pairs counts every tuple.

## Complexity Analysis

- **Time Complexity:** O(n^2), one step per pair in each half.
- **Space Complexity:** O(n^2) for the pair-sum frequencies.

## Implementation

```python
from typing import List
from collections import defaultdict
class Solution:
    def fourSumCount(self, nums1: List[int], nums2: List[int], nums3: List[int], nums4: List[int]) -> int:
        freq = defaultdict(int)
        for a in nums1:
            for b in nums2:
                freq[a + b] += 1
        ans = 0
        for c in nums3:
            for d in nums4:
                ans += freq.get(-(c + d), 0)
        return ans
```
