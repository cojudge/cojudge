## Approach

Tally each character, sort the distinct characters by descending count, then repeat every character according to its count. Any order among equal counts is accepted, which matches the checker that only enforces non-increasing frequencies and identical multisets.

## Complexity Analysis

- **Time Complexity:** O(n + k log k), where n is the length of `s` and k is the number of distinct characters.
- **Space Complexity:** O(n) for the tally and the output.

## Implementation

```python
from collections import Counter
class Solution:
    def frequencySort(self, s: str) -> str:
        freq = Counter(s)
        chars = sorted(freq.keys(), key=lambda c: -freq[c])
        return "".join(c * freq[c] for c in chars)
```
