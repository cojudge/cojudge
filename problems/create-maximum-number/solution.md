## Approach

For every feasible split of `k` into `i` digits from the first array and `k - i` from the second, extract the best subsequence of the required length from each array with a monotonic stack, then greedily merge the two subsequences by comparing remaining suffixes. The maximum over all splits is the answer.

## Complexity Analysis

- **Time Complexity:** O(k * (m + n + k^2)) in the worst case, with m and n up to 500.
- **Space Complexity:** O(k) besides the inputs.

## Implementation

```python
from typing import List
class Solution:
    def maxNumber(self, nums1: List[int], nums2: List[int], k: int) -> List[int]:
        def max_subseq(nums, t):
            drop = len(nums) - t
            st = []
            for v in nums:
                while st and drop and st[-1] < v:
                    st.pop()
                    drop -= 1
                if len(st) < t:
                    st.append(v)
                else:
                    drop -= 1
            return st

        def greater(a, i, b, j):
            while i < len(a) and j < len(b) and a[i] == b[j]:
                i += 1
                j += 1
            if j == len(b):
                return True
            if i == len(a):
                return False
            return a[i] > b[j]

        def merge(a, b):
            i = j = 0
            res = []
            while i < len(a) or j < len(b):
                if greater(a, i, b, j):
                    res.append(a[i])
                    i += 1
                else:
                    res.append(b[j])
                    j += 1
            return res

        best = []
        for i in range(max(0, k - len(nums2)), min(k, len(nums1)) + 1):
            cand = merge(max_subseq(nums1, i), max_subseq(nums2, k - i))
            if greater(cand, 0, best, 0):
                best = cand
        return best
```
