## Approach

Count frequencies with a hash map, then place numbers into buckets indexed by their frequency. Iterate buckets from highest to lowest and collect the top k elements.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

## Implementation

```python
from typing import List
from collections import Counter
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        freq = Counter(nums)
        buckets = [[] for _ in range(len(nums) + 1)]
        for num, f in freq.items():
            buckets[f].append(num)
        res = []
        for i in range(len(buckets) - 1, -1, -1):
            for num in buckets[i]:
                res.append(num)
                if len(res) == k:
                    return res
        return res
```
