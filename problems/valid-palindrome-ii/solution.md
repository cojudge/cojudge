## Approach

Use two pointers `i` at the start and `j` at the end. While the characters match, move both inward. On the first mismatch, try skipping either the left character or the right character and check whether the remaining substring is a palindrome. If either skip yields a palindrome, return true; otherwise return false.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the string. Each position is visited at most twice.
- **Space Complexity:** O(1). Only two pointers and constant extra state are used.

## Implementation

```python
class Solution:
    def validPalindrome(self, s: str) -> bool:
        def is_pal(i: int, j: int) -> bool:
            while i < j:
                if s[i] != s[j]:
                    return False
                i += 1
                j -= 1
            return True
        i, j = 0, len(s) - 1
        while i < j:
            if s[i] != s[j]:
                return is_pal(i + 1, j) or is_pal(i, j - 1)
            i += 1
            j -= 1
        return True
```
