## Approach

Order envelopes by width ascending, breaking ties by height descending so that
envelopes sharing a width can never appear together in a height subsequence.
The nesting task then reduces to the longest strictly increasing subsequence
of heights, solved by keeping pile-top values and placing each height with
binary search.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting plus the subsequence pass.
- **Space Complexity:** O(n) for the pile tops.

## Implementation

```python
import bisect
from typing import List

class Solution:
    def maxEnvelopes(self, envelopes: List[List[int]]) -> int:
        envelopes.sort(key=lambda e: (e[0], -e[1]))
        tails: List[int] = []
        for _, h in envelopes:
            i = bisect.bisect_left(tails, h)
            if i == len(tails):
                tails.append(h)
            else:
                tails[i] = h
        return len(tails)
```
