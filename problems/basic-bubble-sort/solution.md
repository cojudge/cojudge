## Approach

Clone the input and run bubble sort passes. Each pass pushes the largest remaining value to its final slot through adjacent swaps.

## Complexity Analysis

- **Time Complexity:** O(n^2).
- **Space Complexity:** O(n).

## Implementation

```python
from typing import List

class Solution:
    def bubbleSort(self, nums: List[int]) -> List[int]:
        a = list(nums)
        for i in range(len(a)):
            for j in range(len(a) - 1 - i):
                if a[j] > a[j + 1]:
                    a[j], a[j + 1] = a[j + 1], a[j]
        return a
```
