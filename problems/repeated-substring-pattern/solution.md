## Approach

A repeating block must tile the string exactly, so its length has to divide the total length. Try every candidate length from 1 up to half of the string that divides the length, and test whether repeating the prefix of that length reproduces the whole string. Succeed on the first match; if no divisor works, no repeating block exists.

## Complexity Analysis

- **Time Complexity:** O(n^2) in the worst case, from comparing up to O(n) candidates of total length O(n).
- **Space Complexity:** O(n) for the prefix slices.

## Implementation

```python
class Solution:
    def repeatedSubstringPattern(self, s: str) -> bool:
        n = len(s)
        for k in range(1, n // 2 + 1):
            if n % k == 0 and s[:k] * (n // k) == s:
                return True
        return False
```
