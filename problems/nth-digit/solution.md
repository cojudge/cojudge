## Approach

Numbers with the same digit length form blocks: 9 numbers use 1 digit each, 90 use 2 each, 900 use 3 each, and so on. Subtract whole blocks from `n` until the block holding the answer is reached. Then divide the remaining offset by the block's digit length to pick the exact number, and use the remainder to pick the digit inside that number's decimal text.

## Complexity Analysis

- **Time Complexity:** O(log n), one step per digit length.
- **Space Complexity:** O(log n) for the number's string form.

## Implementation

```python
class Solution:
    def findNthDigit(self, n: int) -> int:
        pos = n
        length = 1
        count = 9
        start = 1
        while pos > length * count:
            pos -= length * count
            length += 1
            count *= 10
            start *= 10
        num = start + (pos - 1) // length
        idx = (pos - 1) % length
        return int(str(num)[idx])
```
