## Approach

Scan possible divisors only up to the square root of `num`. Whenever `d` divides `num`, add both `d` and its partner `num / d` to a running total (adding the square root just once). Starting from 1 covers the universal divisor for `num > 1`. The number is perfect exactly when the accumulated total equals `num`.

## Complexity Analysis

- **Time Complexity:** O(sqrt(num)) trial divisions.
- **Space Complexity:** O(1) extra memory.

## Implementation

```python
class Solution:
    def checkPerfectNumber(self, num: int) -> bool:
        if num <= 1:
            return False
        total = 1
        d = 2
        while d * d <= num:
            if num % d == 0:
                total += d
                other = num // d
                if other != d:
                    total += other
                if total > num:
                    return False
            d += 1
        return total == num
```
