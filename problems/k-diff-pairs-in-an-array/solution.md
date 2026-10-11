## Approach

Tally each distinct value's occurrences in a hash map. For `k == 0` a pair needs the same value twice, so every value with a count of at least two adds one. For positive `k`, every distinct value `v` whose partner `v + k` also appears adds exactly one pair. Checking only the `v + k` direction avoids double counting.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`.
- **Space Complexity:** O(n) for the frequency map.

## Implementation

```python
from typing import List
class Solution:
    def findPairs(self, nums: List[int], k: int) -> int:
        from collections import Counter
        freq = Counter(nums)
        if k == 0:
            return sum(1 for c in freq.values() if c >= 2)
        return sum(1 for v in freq if v + k in freq)
```
