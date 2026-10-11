## Approach

Tally each word's occurrences in a hash map. Collect the distinct words and sort them with a two-key comparison: higher frequency first, and dictionary order for equal frequencies. Returning the first `k` entries yields exactly the required ranking.

## Complexity Analysis

- **Time Complexity:** O(n log n), dominated by sorting the distinct words.
- **Space Complexity:** O(n) for the frequency table.

## Implementation

```python
from typing import List
from collections import Counter
class Solution:
    def topKFrequent(self, words: List[str], k: int) -> List[str]:
        freq = Counter(words)
        ordered = sorted(freq.keys(), key=lambda w: (-freq[w], w))
        return ordered[:k]
```
