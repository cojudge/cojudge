## Approach

Because ages only range from 1 to 120, tally the frequency of each age instead of comparing every pair of people. For each ordered pair of distinct age values with nonzero counts, test the three blocking rules directly and add the product of the frequencies (subtracting the self-pair for equal ages). Summing over at most 120 by 120 age pairs is easily fast enough.

## Complexity Analysis

- **Time Complexity:** O(n + A^2) where n is the number of people and A = 120 is the age range.
- **Space Complexity:** O(A) for the frequency table.

## Implementation

```python
from typing import List

class Solution:
    def numFriendRequests(self, ages: List[int]) -> int:
        cnt = [0] * 121
        for a in ages:
            cnt[a] += 1
        ans = 0
        for a in range(1, 121):
            if cnt[a] == 0:
                continue
            for b in range(1, 121):
                if cnt[b] == 0:
                    continue
                if b <= a // 2 + 7:
                    continue
                if b > a:
                    continue
                if b > 100 and a < 100:
                    continue
                ans += cnt[a] * (cnt[b] - (1 if a == b else 0))
        return ans
```
