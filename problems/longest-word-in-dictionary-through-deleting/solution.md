## Approach

A dictionary word can be produced exactly when it appears as a subsequence of `s`. Each word is tested with a two-pointer scan that walks through `s` once while advancing through the word's characters on matches. Every formable word is compared against the best answer seen so far, preferring greater length and breaking ties by alphabetical order.

## Complexity Analysis

- **Time Complexity:** O(D * (S + W)), where D is the dictionary size, S the length of `s`, and W the average word length.
- **Space Complexity:** O(1) besides the output.

## Implementation

```python
from typing import List
class Solution:
    def findLongestWord(self, s: str, dictionary: List[str]) -> str:
        def is_subseq(word):
            j = 0
            for c in s:
                if j < len(word) and c == word[j]:
                    j += 1
            return j == len(word)
        best = ""
        for w in dictionary:
            if is_subseq(w):
                if len(w) > len(best) or (len(w) == len(best) and w < best):
                    best = w
        return best
```
