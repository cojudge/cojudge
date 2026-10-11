## Approach

Run the Sieve of Eratosthenes: keep a boolean table where an entry records whether the index is composite. Scan from 2 upward; each unmarked number is prime and marks its multiples starting from its square. The primes below `n` are exactly the unmarked entries, so count them.

## Complexity Analysis

- **Time Complexity:** O(n log log n) for the sieve.
- **Space Complexity:** O(n) for the composite table.

## Implementation

```python
class Solution:
    def countPrimes(self, n: int) -> int:
        if n <= 2:
            return 0
        composite = bytearray(n)
        count = 0
        for i in range(2, n):
            if not composite[i]:
                count += 1
                if i * i < n:
                    step = i
                    start = i * i
                    composite[start:n:step] = b"\x01" * ((n - 1 - start) // step + 1)
        return count
```
