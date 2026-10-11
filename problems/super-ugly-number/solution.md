## Approach

Keep one pointer per prime into the ugly sequence built so far. Each prime proposes a candidate equal to its prime times the ugly number at its pointer. Repeatedly append the smallest candidate and advance every pointer that produced it, which merges the multiples in order while skipping duplicates.

## Complexity Analysis

- **Time Complexity:** O(n * k), where n is the requested position and k is the number of primes.
- **Space Complexity:** O(n + k) for the sequence and the pointers.

## Implementation

```python
from typing import List
class Solution:
    def nthSuperUglyNumber(self, n: int, primes: List[int]) -> int:
        ugly = [1] * n
        idx = [0] * len(primes)
        nxt = list(primes)
        for i in range(1, n):
            m = min(nxt)
            ugly[i] = m
            for j, p in enumerate(primes):
                if nxt[j] == m:
                    idx[j] += 1
                    nxt[j] = ugly[idx[j]] * p
        return ugly[n - 1]
```
