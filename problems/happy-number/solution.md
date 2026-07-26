## Approach

Use Floyd's cycle detection on the sequence produced by repeatedly summing the squares of the current number's digits. A slow pointer advances by one transformation and a fast pointer advances by two. The number is happy if the fast pointer reaches `1`; otherwise, equal pointers identify a cycle that does not contain `1`.

## Complexity Analysis

- **Time Complexity:** O(log n). The first digit-square transformation examines every digit, and subsequent values are bounded by a constant for 32-bit inputs.
- **Space Complexity:** O(1). The algorithm keeps only two sequence values.

## Implementation

```python
class Solution:
    def isHappy(self, n: int) -> bool:
        slow = n
        fast = self._next(n)
        while fast != 1 and slow != fast:
            slow = self._next(slow)
            fast = self._next(self._next(fast))
        return fast == 1

    def _next(self, n: int) -> int:
        total = 0
        while n > 0:
            digit = n % 10
            total += digit * digit
            n //= 10
        return total
```
