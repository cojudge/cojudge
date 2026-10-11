## Approach

Trim the input, split on runs of whitespace, discard empties, reverse the word list, and rejoin with single spaces. The split-plus-join naturally removes edge spaces and collapses interior gaps.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the string length. Splitting, reversing, and joining each touch the data once.
- **Space Complexity:** O(n) for the word list and output.

## Implementation

```python
class Solution:
    def reverseWords(self, s: str) -> str:
        return " ".join(reversed(s.split()))
```
