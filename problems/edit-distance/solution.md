## Approach

Use dynamic programming over prefixes of the two words. Matching characters carry the
diagonal value forward; differing characters take one plus the best of replacement,
deletion, and insertion. Keep only the previous and current rows, using the shorter
word for the row width.

## Complexity Analysis

- **Time Complexity:** O(m * n), where `m` and `n` are the word lengths.
- **Space Complexity:** O(min(m, n)).

## Implementation

```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        if len(word1) < len(word2):
            word1, word2 = word2, word1

        previous = list(range(len(word2) + 1))
        for i, first in enumerate(word1, 1):
            current = [i] + [0] * len(word2)
            for j, second in enumerate(word2, 1):
                if first == second:
                    current[j] = previous[j - 1]
                else:
                    current[j] = 1 + min(
                        previous[j - 1], previous[j], current[j - 1]
                    )
            previous = current
        return previous[-1]
```
