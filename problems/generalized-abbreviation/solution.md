## Approach

Recurse over the word while carrying the length of the pending abbreviated run. At each character, either extend the run by one or flush the count, keep the character, and reset the run. Flushing any leftover count at the end yields one abbreviation per path, covering all 2^n choices.

## Complexity Analysis

- **Time Complexity:** O(n * 2^n), where n is the word length, for building all abbreviations.
- **Space Complexity:** O(n * 2^n) for the output plus O(n) recursion depth.

## Implementation

```python
from typing import List
class Solution:
    def generateAbbreviations(self, word: str) -> List[str]:
        res = []

        def backtrack(pos: int, count: int, cur: list) -> None:
            if pos == len(word):
                if count:
                    cur.append(str(count))
                res.append("".join(cur))
                if count:
                    cur.pop()
                return
            backtrack(pos + 1, count + 1, cur)
            if count:
                cur.append(str(count))
            cur.append(word[pos])
            backtrack(pos + 1, 0, cur)
            cur.pop()
            if count:
                cur.pop()

        backtrack(0, 0, [])
        return res
```
