## Approach

Keep the sum of the currently even entries. For each query [val, idx], remove nums[idx] from that sum if it is even, apply the addition, then add it back if it is now even. Recording the running sum after every query yields the answer without rescanning the array.

## Complexity Analysis

- **Time Complexity:** O(n + q), where n is the array length and q is the number of queries.
- **Space Complexity:** O(q) for the answer array (O(1) extra).

## Implementation

```python
from typing import List
class Solution:
    def sumEvenAfterQueries(self, nums: List[int], queries: List[List[int]]) -> List[int]:
        even = sum(x for x in nums if x % 2 == 0)
        ans = []
        for v, i in queries:
            if nums[i] % 2 == 0:
                even -= nums[i]
            nums[i] += v
            if nums[i] % 2 == 0:
                even += nums[i]
            ans.append(even)
        return ans
```
