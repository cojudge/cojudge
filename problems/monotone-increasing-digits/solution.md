## Approach

Write `n` as digits and scan from right to left. Whenever a digit exceeds its right neighbour, decrement it and note that everything from the next position onward must turn into `9`. The right-to-left order lets a borrow cascade leftwards through equal runs. Filling the noted tail with `9`s yields the greatest valid value.

## Complexity Analysis

- **Time Complexity:** O(d), where d is the digit count (at most 10).
- **Space Complexity:** O(d) for the digit array.

## Implementation

```python
class Solution:
    def monotoneIncreasingDigits(self, n: int) -> int:
        d = list(str(n))
        mark = len(d)
        for i in range(len(d) - 1, 0, -1):
            if d[i] < d[i - 1]:
                d[i - 1] = str(int(d[i - 1]) - 1)
                mark = i
        for i in range(mark, len(d)):
            d[i] = '9'
        return int("".join(d))
```
