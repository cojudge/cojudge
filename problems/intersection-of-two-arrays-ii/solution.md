## Approach

Tally the first list's frequencies in a map. Then stream through the second list: whenever the current value still has a positive remaining count, append it to the answer and decrement the count. This keeps exactly the shared multiplicity of every value while preserving linear time.

## Complexity Analysis

- **Time Complexity:** O(n + m), where n and m are the list lengths.
- **Space Complexity:** O(min(n, m)) for the frequency table (count the shorter list in practice).

## Implementation

```python
from typing import List
from collections import Counter
class Solution:
    def intersect(self, nums1: List[int], nums2: List[int]) -> List[int]:
        count = Counter(nums1)
        out = []
        for x in nums2:
            if count.get(x, 0) > 0:
                out.append(x)
                count[x] -= 1
        return out
```
