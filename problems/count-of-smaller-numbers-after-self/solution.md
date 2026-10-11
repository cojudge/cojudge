## Approach

Walk the array from right to left while remembering which values have been seen. Coordinate-compress the values to ranks and store their frequencies in a Fenwick tree, which reports how many seen values fall below the current one in logarithmic time and then records the current value.

## Complexity Analysis

- **Time Complexity:** O(n log n), where n is the length of `nums`.
- **Space Complexity:** O(n) for the compressed ranks and the tree.

## Implementation

```python
from typing import List
class Solution:
    def countSmaller(self, nums: List[int]) -> List[int]:
        vals = sorted(set(nums))
        rank = {v: i + 1 for i, v in enumerate(vals)}
        bit = [0] * (len(vals) + 2)

        def query(k):
            s = 0
            while k > 0:
                s += bit[k]
                k -= k & -k
            return s

        def update(k):
            while k < len(bit):
                bit[k] += 1
                k += k & -k

        ans = [0] * len(nums)
        for i in range(len(nums) - 1, -1, -1):
            ans[i] = query(rank[nums[i]] - 1)
            update(rank[nums[i]])
        return ans
```
