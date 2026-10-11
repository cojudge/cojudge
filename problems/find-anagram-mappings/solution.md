## Approach

Collect the positions of every value in the second array with a dictionary from value to a list of indices. Then scan the first array once, popping one stored index for each value to form the answer. Duplicates naturally consume distinct slots in order.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length. Each element is visited a constant number of times.
- **Space Complexity:** O(n) for the value-to-indices table and the output.

## Implementation

```python
from typing import List
from collections import defaultdict
class Solution:
    def anagramMappings(self, nums1: List[int], nums2: List[int]) -> List[int]:
        pos = defaultdict(list)
        for j, v in enumerate(nums2):
            pos[v].append(j)
        ans = []
        for v in nums1:
            ans.append(pos[v].pop())
        return ans
```
