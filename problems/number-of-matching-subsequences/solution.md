## Approach

Precompute a next-occurrence table: for every index in `s` and every letter,
store where that letter next appears at or after the index. Each candidate
word then walks through the table, jumping from one matched position to the
next; a missing jump means the word is not a subsequence. Counting the words
that survive gives the answer.

## Complexity Analysis

- **Time Complexity:** O(|s| * alphabet + total word length). The table costs O(26 * |s|).
- **Space Complexity:** O(26 * |s|) for the table.

## Implementation

```python
from typing import List


class Solution:
    def numMatchingSubseq(self, s: str, words: List[str]) -> int:
        n = len(s)
        nxt = [[-1] * 26 for _ in range(n + 1)]
        for i in range(n - 1, -1, -1):
            nxt[i] = nxt[i + 1][:]
            nxt[i][ord(s[i]) - 97] = i

        def is_subseq(w: str) -> bool:
            pos = 0
            for c in w:
                if pos > n:
                    return False
                found = nxt[pos][ord(c) - 97]
                if found == -1:
                    return False
                pos = found + 1
            return True

        return sum(1 for w in words if is_subseq(w))
```
