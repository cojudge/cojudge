## Approach

Tally each character separately since case is significant. Every pair of identical letters contributes two to the palindrome, one on each side. If any character has an odd remainder, a single leftover can occupy the middle. Summing the paired slots plus at most one center gives the optimum.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the string length.
- **Space Complexity:** O(1), only a fixed alphabet table.

## Implementation

```python
class Solution:
    def longestPalindrome(self, s: str) -> int:
        cnt = [0] * 128
        for ch in s:
            cnt[ord(ch)] += 1
        length = 0
        odd = False
        for c in cnt:
            length += (c // 2) * 2
            if c % 2 == 1:
                odd = True
        return length + 1 if odd else length
```
