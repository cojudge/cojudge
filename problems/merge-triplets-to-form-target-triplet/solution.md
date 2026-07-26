## Approach

Ignore any triplet with a coordinate greater than the corresponding target coordinate, because element-wise maximum operations can never reduce that value. Every remaining triplet is safe to merge. Record which of the three target coordinates are matched exactly by safe triplets; the target is reachable if and only if all three coordinates are matched.

## Complexity Analysis

- **Time Complexity:** O(n), because each triplet has exactly three coordinates.
- **Space Complexity:** O(1) auxiliary space.

## Implementation

```python
from typing import List


class Solution:
    def mergeTriplets(self, triplets: List[List[int]], target: List[int]) -> bool:
        matched = [False, False, False]
        for triplet in triplets:
            if any(triplet[index] > target[index] for index in range(3)):
                continue
            for index in range(3):
                matched[index] |= triplet[index] == target[index]
        return all(matched)
```
