## Approach

Walk every row `i` and every column `j` inside that row. The mirror position `(j, i)` must exist and hold the same letter; a missing character on exactly one side, or a differing letter, rejects the layout. If the whole scan succeeds, rows and columns mirror each other.

## Complexity Analysis

- **Time Complexity:** O(total characters in `words`). Each character pair is examined once.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
class Solution:
    def validWordSquare(self, words):
        n = len(words)
        for i, row in enumerate(words):
            for j, ch in enumerate(row):
                if j >= n:
                    return False
                if i >= len(words[j]):
                    return False
                if words[j][i] != ch:
                    return False
        return True
```
