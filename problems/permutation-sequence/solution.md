## Approach

There are (n-1)! orderings for each choice of leading digit, so the first digit is determined by dividing the 0-based rank by (n-1)!. Remove that digit, then repeat with the remainder and the next smaller factorial until all positions are fixed.

## Complexity Analysis

- **Time Complexity:** O(n^2) due to list removals, with n at most 9.
- **Space Complexity:** O(n) for the remaining digits and factorials.

## Implementation

```python
class Solution:
    def getPermutation(self, n: int, k: int) -> str:
        digits = list(range(1, n + 1))
        fact = [1] * (n + 1)
        for i in range(1, n + 1):
            fact[i] = fact[i - 1] * i
        k -= 1
        res = []
        for i in range(n, 0, -1):
            idx = k // fact[i - 1]
            k %= fact[i - 1]
            res.append(str(digits.pop(idx)))
        return "".join(res)
```
