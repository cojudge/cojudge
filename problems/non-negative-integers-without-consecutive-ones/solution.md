## Approach

Let f[k] count binary strings of length k without adjacent ones (Fibonacci). Walking the bits of n from the top, each 1 lets the lower k bits vary freely, contributing f[k]; meeting two ones in a row ends the walk, otherwise n itself counts once more.

## Complexity Analysis

- **Time Complexity:** O(31).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def findIntegers(self, n: int) -> int:
        f = [1, 2] + [0] * 30
        for i in range(2, 32):
            f[i] = f[i-1] + f[i-2]
        ans, prev = 0, 0
        for k in range(30, -1, -1):
            if (n >> k) & 1:
                ans += f[k]
                if prev:
                    return ans
                prev = 1
            else:
                prev = 0
        return ans + 1
```
