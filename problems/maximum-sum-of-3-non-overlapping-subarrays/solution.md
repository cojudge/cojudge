## Approach

Slide once to obtain every length-`k` window sum. Build a left-best table where each entry remembers the highest-sum window start at or before it (keeping the smaller index on ties), and a right-best table where each entry remembers the best start at or after it (keeping the smaller index when scanning from the right with a non-strict comparison). Then treat each feasible position as the middle block and pair it with its best compatible left and right neighbours, retaining the greatest total and breaking ties toward the dictionary-smallest triple.

## Complexity Analysis

- **Time Complexity:** O(n) for the slide plus O(n) for the middle scan.
- **Space Complexity:** O(n) for window sums and best tables.

## Implementation

```python
from typing import List
class Solution:
    def maxSumOfThreeSubarrays(self, nums: List[int], k: int) -> List[int]:
        n = len(nums)
        m = n - k + 1
        w = [0]*m
        s = sum(nums[:k])
        w[0] = s
        for i in range(1, m):
            s += nums[i+k-1] - nums[i-1]
            w[i] = s
        left = [0]*m
        best = 0
        for i in range(m):
            if w[i] > w[best]:
                best = i
            left[i] = best
        right = [0]*m
        best = m-1
        for i in range(m-1, -1, -1):
            if w[i] >= w[best]:
                best = i
            right[i] = best
        ans = [-1,-1,-1]
        best_total = -1
        for j in range(k, m-k):
            i = left[j-k]
            l = right[j+k]
            tot = w[i]+w[j]+w[l]
            if tot > best_total or (tot == best_total and [i,j,l] < ans):
                best_total = tot
                ans = [i,j,l]
        return ans
```
