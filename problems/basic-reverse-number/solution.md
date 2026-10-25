## Approach

Repeatedly take the last digit of the input and append it to the answer. Appending means multiplying the answer by ten and adding the digit.

## Complexity Analysis

- **Time Complexity:** O(log n).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def reverseNumber(self, n: int) -> int:
        rev = 0
        while n > 0:
            rev = rev * 10 + n % 10
            n //= 10
        return rev
```
