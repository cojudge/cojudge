## Approach

Order the indices by score from largest to smallest; the order position is exactly the rank. Walk that ordering once, writing `"Gold Medal"`, `"Silver Medal"`, `"Bronze Medal"` for the first three places and the decimal rank for everything after. Mapping back through the sorted indices restores the original input order.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting the n indices.
- **Space Complexity:** O(n) for the index array and the answer.

## Implementation

```python
from typing import List

class Solution:
    def findRelativeRanks(self, score: List[int]) -> List[str]:
        order = sorted(range(len(score)), key=lambda i: -score[i])
        ans = [""] * len(score)
        for rank, i in enumerate(order, start=1):
            if rank == 1:
                ans[i] = "Gold Medal"
            elif rank == 2:
                ans[i] = "Silver Medal"
            elif rank == 3:
                ans[i] = "Bronze Medal"
            else:
                ans[i] = str(rank)
        return ans
```
