## Approach

Scan both strings together while remembering, for every character, the index of its most recent occurrence on each side. Two positions are compatible exactly when the previous occurrence indices of `s[i]` and `t[i]` agree; a mismatch means some character would need two images, or two characters would share one image. Stamping the current index on both sides keeps the mapping consistent in both directions.

## Complexity Analysis

- **Time Complexity:** O(n), one pass over the strings.
- **Space Complexity:** O(1), two fixed-size tables for the ASCII alphabet.

## Implementation

```python
class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        last_s = {}
        last_t = {}
        for i, (a, b) in enumerate(zip(s, t)):
            if last_s.get(a, -1) != last_t.get(b, -1):
                return False
            last_s[a] = i
            last_t[b] = i
        return True
```
