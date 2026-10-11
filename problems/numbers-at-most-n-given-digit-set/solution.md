## Approach

Split the tally by length. Every length shorter than the ceiling contributes `D^len` builds. For the same length as `n`, scan its decimal digits left to right: at position `i`, each stamp smaller than the ceiling's digit opens `D^(remaining)` completions for the suffix. If the whole ceiling digit-string can be spelled with stamps, count the ceiling itself as well.

## Complexity Analysis

- **Time Complexity:** O(L * D) with L at most 10 digits and D at most 9.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def atMostNGivenDigitSet(self, digits: List[str], n: int) -> int:
        s = str(n)
        L, D = len(s), len(digits)
        ans = sum(D ** k for k in range(1, L))
        for i, ch in enumerate(s):
            same = False
            for d in digits:
                if d < ch:
                    ans += D ** (L - 1 - i)
                elif d == ch:
                    same = True
            if not same:
                return ans
        return ans + 1
```
