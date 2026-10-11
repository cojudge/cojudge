## Approach

Sort all words by length and scan length groups in order. Keep a set of every strictly shorter word seen so far. For each candidate, run a word-break dynamic program that asks whether the candidate splits into pieces from that set. Grouping equal lengths together guarantees no word ever uses itself or another word of the same length. Collect every candidate that splits successfully.

## Complexity Analysis

- **Time Complexity:** O(T * L^2) where T is the number of words and L is the longest word length (each split check is quadratic in word length).
- **Space Complexity:** O(S) for the dictionary set plus O(L) per DP check, where S is the total input size.

## Implementation

```python
from typing import List

class Solution:
    def findAllConcatenatedWordsInADict(self, words: List[str]) -> List[str]:
        ordered = sorted(words, key=len)
        seen = set()
        out = []
        i = 0
        while i < len(ordered):
            j = i
            while j < len(ordered) and len(ordered[j]) == len(ordered[i]):
                j += 1
            for k in range(i, j):
                w = ordered[k]
                if seen and self._can_form(w, seen):
                    out.append(w)
            for k in range(i, j):
                seen.add(ordered[k])
            i = j
        return out

    def _can_form(self, s: str, vocab: set) -> bool:
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True
        for end in range(1, n + 1):
            for start in range(end):
                if dp[start] and s[start:end] in vocab:
                    dp[end] = True
                    break
        return dp[n]
```
