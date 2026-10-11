## Approach

Store each word's position in a map. For every word, try all split points: when the left part reads as a palindrome, the reversed right part (if present as another word) belongs in front; when the right part is a palindrome, the reversed left part belongs behind. Checking both orientations at every cut discovers all completions, including empty-string and full-reversal cases, without pairwise testing.

## Complexity Analysis

- **Time Complexity:** O(n * k^2), where n is the word count and k the max length, for split checks and palindrome tests.
- **Space Complexity:** O(n * k) for the index map and output.

## Implementation

```python
from typing import List
class Solution:
    def palindromePairs(self, words: List[str]) -> List[List[int]]:
        pos = {w: i for i, w in enumerate(words)}
        res = []
        seen = set()
        def is_pal(s):
            return s == s[::-1]
        for i, w in enumerate(words):
            n = len(w)
            for cut in range(n + 1):
                left, right = w[:cut], w[cut:]
                if is_pal(left):
                    need = right[::-1]
                    j = pos.get(need)
                    if j is not None and j != i and (j, i) not in seen:
                        seen.add((j, i))
                        res.append([j, i])
                if right and is_pal(right):
                    need = left[::-1]
                    j = pos.get(need)
                    if j is not None and j != i and (i, j) not in seen:
                        seen.add((i, j))
                        res.append([i, j])
        return res
```
