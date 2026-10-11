## Approach

Expand around every possible center to discover palindromes while maintaining `cuts[i]`, the cheapest cut count for the prefix ending before index `i`. Whenever a palindrome spans `[l, r]`, the prefix through `r` can be cut after `l - 1` plus one more cut, so relax `cuts[r + 1]` accordingly.

## Complexity Analysis

- **Time Complexity:** O(n^2), where n is the string length. Each center expands outward.
- **Space Complexity:** O(n) for the cuts array.

## Implementation

```python
class Solution:
    def minCut(self, s: str) -> int:
        n = len(s)
        cuts = list(range(-1, n))
        for center in range(n):
            self._expand(s, center, center, cuts)
            self._expand(s, center, center + 1, cuts)
        return cuts[n]

    def _expand(self, s, l, r, cuts):
        n = len(s)
        while l >= 0 and r < n and s[l] == s[r]:
            if cuts[l] + 1 < cuts[r + 1]:
                cuts[r + 1] = cuts[l] + 1
            l -= 1
            r += 1
```
