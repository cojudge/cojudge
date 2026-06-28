## Approach
Expand around each character as a potential center, handling both odd-length (single center) and even-length (two adjacent centers) palindromes. Keep expanding outward while the characters match, updating the longest palindrome found.

## Complexity Analysis
- **Time Complexity:** O(n²)
- **Space Complexity:** O(1)

## Implementation
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        res = ''
        for i in range(len(s)):
            for l, r in ((i, i), (i, i + 1)):
                while l >= 0 and r < len(s) and s[l] == s[r]:
                    if r - l + 1 > len(res):
                        res = s[l:r+1]
                    l -= 1
                    r += 1
        return res
```
