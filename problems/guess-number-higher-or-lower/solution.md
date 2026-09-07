## Approach

Simulate the hidden `guess` API with a local comparison against `pick`,
then binary-search the inclusive range `[1, n]`. When the simulated API
says the guess is low, discard the left half; when it says high, discard
the right half.

## Complexity Analysis

- **Time Complexity:** O(log n)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def guessNumber(self, n: int, pick: int) -> int:
        def guess(num: int) -> int:
            if num > pick:
                return -1
            if num < pick:
                return 1
            return 0

        left, right = 1, n
        while left <= right:
            mid = left + (right - left) // 2
            r = guess(mid)
            if r == 0:
                return mid
            if r < 0:
                right = mid - 1
            else:
                left = mid + 1
        return -1
```
