## Approach

Give every word a one-letter-prefix abbreviation, falling back to the full word whenever shortening saves nothing. Then repeatedly collect words by their current abbreviation: in any group of two or more, lengthen each member's prefix by one letter and rebuild. Because prefixes only grow and full words are always distinct, the process must settle with all unique results.

## Complexity Analysis

- **Time Complexity:** O(n * L^2) in the worst case, where n is the word count and L the maximum length, since each word's prefix can grow up to its full length.
- **Space Complexity:** O(n * L) for the answers and grouping map.

## Implementation

```python
from typing import List
class Solution:
    def wordsAbbreviation(self, words: List[str]) -> List[str]:
        def abbr(w, pref):
            if pref + 2 >= len(w):
                return w
            return w[:pref] + str(len(w) - pref - 1) + w[-1]
        n = len(words)
        pref = [1] * n
        ans = [abbr(w, 1) for w in words]
        while True:
            groups = {}
            for i, a in enumerate(ans):
                groups.setdefault(a, []).append(i)
            dup = [g for g in groups.values() if len(g) > 1]
            if not dup:
                break
            for g in dup:
                for i in g:
                    pref[i] += 1
                    ans[i] = abbr(words[i], pref[i])
        return ans
```
