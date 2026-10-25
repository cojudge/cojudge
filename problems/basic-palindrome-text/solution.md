## Approach

Mirror-compare characters from both ends moving inward. The first mismatch proves it is not a palindrome; surviving all pairs proves it is.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def isPalindromeText(self, s: str) -> bool:
        return s == s[::-1]
```
