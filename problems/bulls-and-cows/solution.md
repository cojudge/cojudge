## Approach

Count bulls in one pass while tallying leftover digit frequencies for both strings; cows are the per-digit minima of those leftovers.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def getHint(self, secret: str, guess: str) -> str:
        bulls = sum(a == b for a, b in zip(secret, guess))
        s = [0] * 10
        g = [0] * 10
        for a, b in zip(secret, guess):
            if a != b:
                s[ord(a) - 48] += 1
                g[ord(b) - 48] += 1
        cows = sum(min(x, y) for x, y in zip(s, g))
        return f"{bulls}A{cows}B"
```
