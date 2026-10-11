## Approach

Split the string on spaces to get the words, flip the list, and glue the pieces back with single spaces. This mirrors the classic two-step in-place method (reverse everything, then reverse each word) but allocates the answer, which fits the offline string-in/string-out form.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the string length.
- **Space Complexity:** O(n) for the word list and the result.

## Implementation

```python
class Solution:
    def reverseWords(self, s: str) -> str:
        words = s.split(" ")
        words.reverse()
        return " ".join(words)
```
