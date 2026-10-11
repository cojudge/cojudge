## Approach

After deleting 9s, the survivors line up exactly like base-9 counting read as decimal digits. So convert `n` into base 9 and interpret the resulting digits as a decimal number: repeatedly take `n % 9` as the next digit and multiply the place value by 10.

## Complexity Analysis

- **Time Complexity:** O(log n) divisions by 9.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def newInteger(self, n: int) -> int:
        ans = 0
        base = 1
        while n > 0:
            ans += (n % 9) * base
            n //= 9
            base *= 10
        return ans
```
