## Approach

Tally the uppercase letters in a single pass. Zero tallies accept the all-lowercase shape and a full-length tally accepts the all-uppercase shape. Any other total is valid only when the single uppercase letter leads the word, which covers the capitalized shape and rejects everything else.

## Complexity Analysis

- **Time Complexity:** O(n) to scan the word once.
- **Space Complexity:** O(1) extra memory.

## Implementation

```python
class Solution:
    def detectCapitalUse(self, word: str) -> bool:
        upper = sum(1 for c in word if c.isupper())
        if upper == 0 or upper == len(word):
            return True
        return upper == 1 and word[0].isupper()
```
