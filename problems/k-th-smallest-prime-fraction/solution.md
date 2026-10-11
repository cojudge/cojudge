## Approach

List every numerator/denominator pair with `i < j` and order the pairs by
the cross product `a*d` versus `c*b`, which matches the order of the true
quotients without any rounding error. The element at position `k-1` in that
order is the requested fraction. This direct enumeration is easily fast
enough for the given limits; a binary search on the value would be the
follow-up optimization.

## Complexity Analysis

- **Time Complexity:** O(m^2 log m), where m is the array length and the pair count is O(m^2).
- **Space Complexity:** O(m^2) to hold all pairs.

## Implementation

```python
from typing import List
from functools import cmp_to_key


class Solution:
    def kthSmallestPrimeFraction(self, arr: List[int], k: int) -> List[int]:
        pairs = []
        n = len(arr)
        for i in range(n):
            for j in range(i + 1, n):
                pairs.append((arr[i], arr[j]))

        def cmp(a, b):
            left = a[0] * b[1]
            right = b[0] * a[1]
            return (left > right) - (left < right)

        pairs.sort(key=cmp_to_key(cmp))
        return [pairs[k - 1][0], pairs[k - 1][1]]
```
