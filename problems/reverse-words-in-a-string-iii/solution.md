## Approach

Split the sentence at each space to obtain the words, flip every word's characters, and glue the pieces back together with single spaces. Because the split preserves word boundaries, the order and spacing of the sentence are untouched.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the sentence length. Each character is visited a constant number of times.
- **Space Complexity:** O(n) for the word list and the rebuilt answer.

## Implementation

```python
class Solution:
    def reverseWords(self, s: str) -> str:
        return " ".join(w[::-1] for w in s.split(" "))
```
