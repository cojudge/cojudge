## Approach

Implement merge sort: recursively split the array into halves, sort each half, then merge the two sorted halves with a two-pointer pass. This guarantees `O(n log n)` time without using built-in sort. (Any `O(n log n)` sort such as quicksort with random pivot is also acceptable.)

## Complexity Analysis

- **Time Complexity:** O(n log n) in all cases for merge sort, where n is the length of `nums`.
- **Space Complexity:** O(n) for the temporary merge buffers (O(log n) stack plus O(n) merge space).

## Implementation

```python
from typing import List
class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        def merge_sort(a):
            if len(a) <= 1:
                return a
            mid = len(a) // 2
            left = merge_sort(a[:mid])
            right = merge_sort(a[mid:])
            i = j = 0
            out = []
            while i < len(left) and j < len(right):
                if left[i] <= right[j]:
                    out.append(left[i])
                    i += 1
                else:
                    out.append(right[j])
                    j += 1
            out.extend(left[i:])
            out.extend(right[j:])
            return out
        return merge_sort(nums)
```
