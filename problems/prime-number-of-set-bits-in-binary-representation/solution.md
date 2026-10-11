## Approach

Iterate over the closed interval and count the one-bits of each value with a popcount operation. Look up whether that count is prime (only 2, 3, 5, 7, 11, 13, 17, 19 are reachable below 10^6) and tally the hits.

## Complexity Analysis

- **Time Complexity:** O((right - left + 1) * log right) for scanning and bit counting.
- **Space Complexity:** O(1) besides the answer.

## Implementation

```python
class Solution:
    def countPrimeSetBits(self, left: int, right: int) -> int:
        primes = {2, 3, 5, 7, 11, 13, 17, 19}
        ans = 0
        for x in range(left, right + 1):
            if bin(x).count("1") in primes:
                ans += 1
        return ans
```
