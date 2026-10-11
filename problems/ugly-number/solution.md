## Approach

Reject non-positive inputs immediately. Repeatedly divide out 2, 3 and 5; if only allowed primes were present, nothing but 1 can remain. Any leftover above 1 must contain another prime factor.

## Complexity Analysis

- **Time Complexity:** O(log n) divisions.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def isUgly(self, n: int) -> bool:
        if n <= 0:
            return False
        for p in (2, 3, 5):
            while n % p == 0:
                n //= p
        return n == 1
```
