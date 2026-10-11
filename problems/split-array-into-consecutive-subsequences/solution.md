## Approach

Count each value. Sweep the sorted array: if some earlier group waits for the current value, extend it; otherwise start a new triple consuming `v`, `v+1`, `v+2`. Missing copies mean the split is impossible. Greedy extension is safe because using a value to continue a group never hurts future triples.

## Complexity Analysis

- **Time Complexity:** O(n) with hash-table counts.
- **Space Complexity:** O(n) for the frequency and need tables.

## Implementation

```python
from typing import List
from collections import Counter
class Solution:
    def isPossible(self, nums: List[int]) -> bool:
        freq = Counter(nums)
        need = Counter()
        for x in nums:
            if freq[x] == 0:
                continue
            if need[x] > 0:
                need[x] -= 1
                freq[x] -= 1
                need[x + 1] += 1
            else:
                if freq[x + 1] == 0 or freq[x + 2] == 0:
                    return False
                freq[x] -= 1
                freq[x + 1] -= 1
                freq[x + 2] -= 1
                need[x + 3] += 1
        return True
```
