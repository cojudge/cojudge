## Approach

Give every child one candy, then run two passes. A left-to-right pass guarantees that a child with a higher rating than the child on their left receives more candies. A right-to-left pass guarantees the same toward the right. The candy count for each child is the maximum produced by the two passes, and summing those counts gives the minimum total.

## Complexity Analysis

- **Time Complexity:** O(n), where `n` is `ratings.length`.
- **Space Complexity:** O(n) for the candies array.

## Implementation

```python
from typing import List

class Solution:
    def candy(self, ratings: List[int]) -> int:
        n = len(ratings)
        candies = [1] * n
        for i in range(1, n):
            if ratings[i] > ratings[i - 1]:
                candies[i] = candies[i - 1] + 1
        for i in range(n - 2, -1, -1):
            if ratings[i] > ratings[i + 1]:
                candies[i] = max(candies[i], candies[i + 1] + 1)
        return sum(candies)
```