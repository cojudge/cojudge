## Approach

Gather the coordinates of ones in both matrices, since zeros never contribute. Every pair of ones (one from each image) determines the shift that would place them on top of each other, so count how many pairs agree on each shift vector. The highest count is the best achievable overlap, and an empty one-list on either side yields zero immediately.

## Complexity Analysis

- **Time Complexity:** O(a * b) where a and b are the numbers of ones in the two images (at most n^4 for n by n inputs, fine for n <= 30).
- **Space Complexity:** O(a * b) in the worst case for the shift histogram.

## Implementation

```python
from typing import List
from collections import Counter

class Solution:
    def largestOverlap(self, img1: List[List[int]], img2: List[List[int]]) -> int:
        a = [(i, j) for i, row in enumerate(img1) for j, v in enumerate(row) if v == 1]
        b = [(i, j) for i, row in enumerate(img2) for j, v in enumerate(row) if v == 1]
        if not a or not b:
            return 0
        votes = Counter((q0 - p0, q1 - p1) for p0, p1 in a for q0, q1 in b)
        return max(votes.values())
```
