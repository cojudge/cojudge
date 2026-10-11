## Approach

Treat the number as a digit sequence and locate its next lexicographic permutation: find the rightmost pivot that is smaller than the digit after it, swap it with the smallest larger digit to its right, and reverse the tail so it is increasing. A missing pivot means the digits descend and no greater value exists. The rebuilt number is checked against the 32-bit signed limit before returning.

## Complexity Analysis

- **Time Complexity:** O(d), where d is the number of digits (at most 10).
- **Space Complexity:** O(d) for the digit array.

## Implementation

```python
class Solution:
    def nextGreaterElement(self, n: int) -> int:
        d = list(str(n))
        i = len(d) - 2
        while i >= 0 and d[i] >= d[i + 1]:
            i -= 1
        if i < 0:
            return -1
        j = len(d) - 1
        while d[j] <= d[i]:
            j -= 1
        d[i], d[j] = d[j], d[i]
        d[i + 1:] = reversed(d[i + 1:])
        v = int("".join(d))
        return v if v <= 2 ** 31 - 1 else -1
```
