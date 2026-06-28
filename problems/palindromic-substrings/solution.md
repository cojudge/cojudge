## Approach

Expand around each character (odd-length palindromes) and each gap between characters (even-length palindromes), counting all palindromic substrings found.

## Complexity Analysis

- **Time Complexity:** O(n²)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        n = len(s)
        cnt = 0
        for i in range(n):
            for l, r in ((i, i), (i, i + 1)):
                while l >= 0 and r < n and s[l] == s[r]:
                    cnt += 1
                    l -= 1
                    r += 1
        return cnt
```
