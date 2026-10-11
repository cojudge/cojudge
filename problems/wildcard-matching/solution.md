## Approach

Scan the text and pattern together with two pointers. Matching characters (or `?`) advance both; a `*` is recorded along with the current text position while the pattern moves on. On a mismatch, fall back to the last star and let it swallow one more character. Trailing stars are skipped at the end, and success means the whole pattern was consumed.

## Complexity Analysis

- **Time Complexity:** O(n * m) worst case, where n and m are the text and pattern lengths; typically near-linear.
- **Space Complexity:** O(1) extra space.

## Implementation

```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        i = j = 0
        star, mark = -1, 0
        while i < len(s):
            if j < len(p) and (p[j] == '?' or p[j] == s[i]):
                i += 1
                j += 1
            elif j < len(p) and p[j] == '*':
                star = j
                mark = i
                j += 1
            elif star != -1:
                j = star + 1
                mark += 1
                i = mark
            else:
                return False
        while j < len(p) and p[j] == '*':
            j += 1
        return j == len(p)
```
