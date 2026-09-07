## Approach

Recursion with memoization over start positions. At each position `start`, every dictionary word that matches the substring beginning at `start` is a candidate; for each match we append the word to every sentence produced by segmenting the remaining suffix starting at `start + len(word)`. Because the suffix work depends only on the start index, memoizing by position avoids recomputing the same suffix multiple times. The empty sentence at the end of the string serves as the base case.

## Complexity Analysis

- **Time Complexity:** O(n * L * R) where n is `s.length`, L is the maximum length of a dictionary word (checked at each position), and R is the number of results produced for a suffix. Since results are memoized per position, each position contributes its combinations only once.
- **Space Complexity:** O(n * R) for the memoized lists plus the recursion stack depth of O(n).

## Implementation

```python
from typing import List


class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> List[str]:
        words = set(wordDict)
        n = len(s)
        memo: dict[int, List[str]] = {}

        def break_at(start: int) -> List[str]:
            if start == n:
                return [""]
            if start in memo:
                return memo[start]
            result: List[str] = []
            for word in words:
                if s.startswith(word, start):
                    for tail in break_at(start + len(word)):
                        result.append(word if not tail else word + " " + tail)
            memo[start] = result
            return result

        return break_at(0)
```