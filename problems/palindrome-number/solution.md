## Approach

Reject negatives and non-zero multiples of 10 up front, since neither can read the same both ways. Then repeatedly move the last digit of `x` onto a reversed accumulator until the accumulator catches up with what remains. For even-length inputs the halves must match exactly; for odd lengths the middle digit is discarded before comparing.

## Complexity Analysis

- **Time Complexity:** O(log x), proportional to the number of digits.
- **Space Complexity:** O(1) extra space.

## Implementation

```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0 or (x % 10 == 0 and x != 0):
            return False
        rev = 0
        while x > rev:
            rev = rev * 10 + x % 10
            x //= 10
        return x == rev or x == rev // 10
```
