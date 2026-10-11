## Approach

Count the ones. All zeros can use the ends; a count not divisible by three is impossible. Otherwise locate the first one of each third and measure the trailing tail from the third start to the end. All three blocks must share that exact tail, and the tail must fit without overlapping. The cut points follow directly from the tail length.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `arr`. Counting, locating starts, and comparing tails are linear.
- **Space Complexity:** O(1) besides the output.

## Implementation

```python
from typing import List
class Solution:
    def threeEqualParts(self, arr: List[int]) -> List[int]:
        n = len(arr)
        total = sum(arr)
        if total == 0:
            return [0, n - 1]
        if total % 3 != 0:
            return [-1, -1]
        k = total // 3
        i1 = i2 = i3 = -1
        cnt = 0
        for i, v in enumerate(arr):
            if v == 1:
                cnt += 1
                if cnt == 1:
                    i1 = i
                elif cnt == k + 1:
                    i2 = i
                elif cnt == 2 * k + 1:
                    i3 = i
        length = n - i3
        for t in range(length):
            if arr[i1 + t] != arr[i2 + t] or arr[i2 + t] != arr[i3 + t]:
                return [-1, -1]
        end_first = i1 + length - 1
        start_third = i2 + length
        if end_first + 1 >= start_third or start_third >= n:
            return [-1, -1]
        return [end_first, start_third]
```
