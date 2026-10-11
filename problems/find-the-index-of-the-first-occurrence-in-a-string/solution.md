## Approach

Slide a window over the text: for each start position that still leaves room for the pattern, compare the pattern character by character. The first position with a full match is the answer, and exhausting all starts without success yields -1.

## Complexity Analysis

- **Time Complexity:** O(n * m) in the worst case, where n and m are the lengths of the text and pattern.
- **Space Complexity:** O(1) extra space.

## Implementation

```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        n, m = len(haystack), len(needle)
        for i in range(n - m + 1):
            if haystack[i:i + m] == needle:
                return i
        return -1
```
