## Approach

Small inputs are answered directly, since 2, 3, 5, 7 and 11 cover everything up to 11. Longer even-length palindromes are divisible by 11, so only odd lengths can yield new prime palindromes. Build each odd-length palindrome by mirroring its first half in numeric order and return the first one that is at least `n` and passes a trial-division primality test.

## Complexity Analysis

- **Time Complexity:** Roughly proportional to the count of palindromes tried times the square root of the value for trial division; tiny in practice for the given limits.
- **Space Complexity:** O(1) besides a few counters.

## Implementation

```python
class Solution:
    def primePalindrome(self, n: int) -> int:
        def is_prime(x: int) -> bool:
            if x < 2:
                return False
            if x % 2 == 0:
                return x == 2
            d = 3
            while d * d <= x:
                if x % d == 0:
                    return False
                d += 2
            return True
        if n <= 2:
            return 2
        if n <= 3:
            return 3
        if n <= 5:
            return 5
        if n <= 7:
            return 7
        if n <= 11:
            return 11
        length = len(str(n))
        while True:
            if length % 2 == 1:
                start = 10 ** ((length - 1) // 2)
                end = 10 ** ((length + 1) // 2)
                for half in range(start, end):
                    s = str(half)
                    pal = int(s + s[-2::-1])
                    if pal < n:
                        continue
                    if is_prime(pal):
                        return pal
            length += 1
```
