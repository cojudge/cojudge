## Approach

Run-length encode the stretched string and each candidate into blocks of (letter, count). A candidate is stretchy when the block letters line up exactly and every count pair is either equal or the stretched count is at least 3 and at least as large. Scanning both strings with two pointers builds these blocks on the fly without extra storage. Counting the candidates that pass gives the answer.

## Complexity Analysis

- **Time Complexity:** O(n + total word length), where n is the length of `s`. Each character is visited once per comparison.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
from typing import List
class Solution:
    def expressiveWords(self, s: str, words: List[str]) -> int:
        def stretchy(w: str) -> bool:
            i = j = 0
            n, m = len(s), len(w)
            while i < n and j < m:
                if s[i] != w[j]:
                    return False
                cs = s[i]
                ni = i
                while ni < n and s[ni] == cs:
                    ni += 1
                nj = j
                while nj < m and w[nj] == cs:
                    nj += 1
                ls, lw = ni - i, nj - j
                if ls != lw and (ls < 3 or ls < lw):
                    return False
                i, j = ni, nj
            return i == n and j == m
        return sum(1 for w in words if stretchy(w))
```
