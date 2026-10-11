## Approach

Traverse the characters from left to right, keeping a mutable buffer. Digits
have a single continuation, while each letter forks into a lower-case branch
and an upper-case branch. When the end of the string is reached, the buffer
holds one complete variant. Collecting all leaves yields every case mix.

## Complexity Analysis

- **Time Complexity:** O(m * 2^m), where m is the letter count: that many strings of that length are produced.
- **Space Complexity:** O(m * 2^m) for the output, plus O(m) recursion depth.

## Implementation

```python
from typing import List


class Solution:
    def letterCasePermutation(self, s: str) -> List[str]:
        result: List[str] = []
        chars = list(s)

        def backtrack(i: int) -> None:
            if i == len(chars):
                result.append("".join(chars))
                return
            if chars[i].isalpha():
                chars[i] = chars[i].lower()
                backtrack(i + 1)
                chars[i] = chars[i].upper()
                backtrack(i + 1)
            else:
                backtrack(i + 1)

        backtrack(0)
        return result
```
