## Approach

Scan left to right planting wherever the current and neighboring plots are empty. Greedy works because using the earliest slot leaves maximal room to the right.

## Complexity Analysis

- **Time Complexity:** O(m).
- **Space Complexity:** O(1) besides a copy.

## Implementation

```python
from typing import List
class Solution:
    def canPlaceFlowers(self, flowerbed: List[int], n: int) -> bool:
        a = list(flowerbed)
        placed = 0
        for i in range(len(a)):
            if a[i]==0 and (i==0 or a[i-1]==0) and (i==len(a)-1 or a[i+1]==0):
                a[i]=1; placed+=1
                if placed>=n:
                    return True
        return placed>=n
```
