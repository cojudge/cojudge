## Approach

Keeping columns is equivalent to finding the longest subsequence of column positions whose letters never decrease in any row. Let `dp[i]` be the best keepable count among columns ending at position `i`; column `i` can follow column `j` exactly when every row's letter at `j` does not exceed its letter at `i`. The longest keepable run subtracted from the width gives the fewest deletions.

## Complexity Analysis

- **Time Complexity:** O(R * W^2) for R rows and W columns.
- **Space Complexity:** O(W) for the DP array.

## Implementation

```python
class Solution:
    def minDeletionSize(self, strs: list[str]) -> int:
        w = len(strs[0])
        dp = [1] * w
        for i in range(w):
            for j in range(i):
                if all(r[j] <= r[i] for r in strs):
                    dp[i] = max(dp[i], dp[j] + 1)
        return w - max(dp)
```
