## Approach

For each index `i`, keep a map from gap value to how many subsequences of length at least two end at `i` with that gap. When pairing `j < i`, the gap `nums[i]-nums[j]` extends every such subsequence ending at `j` into a longer arithmetic subsequence ending at `i`, and each extension adds one valid answer of length at least three. The pair itself starts a new weak pair for future extensions.

## Complexity Analysis

- **Time Complexity:** O(n^2), one gap examined per index pair.
- **Space Complexity:** O(n^2) for the per-index gap maps in the worst case.

## Implementation

```python
from typing import List
from collections import defaultdict
class Solution:
    def numberOfArithmeticSlices(self, nums: List[int]) -> int:
        n = len(nums)
        dp = [defaultdict(int) for _ in range(n)]
        ans = 0
        for i in range(n):
            for j in range(i):
                d = nums[i] - nums[j]
                cj = dp[j][d]
                ci = dp[i][d]
                ans += cj
                dp[i][d] = ci + cj + 1
        return ans
```
