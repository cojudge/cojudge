## Approach

Keep a pointer to the current count/value pair plus how many copies of that value remain. Zero-count pairs are skipped without producing output. Each `next(n)` call repeatedly subtracts from the remainder: when `n` fits inside the remainder, deduct and report the current value; otherwise consume the whole remainder, remember its value, jump to the next pair, and continue. If the pairs run out before `n` reaches zero, the call reports `-1`.

## Complexity Analysis

- **Time Complexity:** O(p + q) where p is the number of pairs scanned and q the number of calls; each pair is visited at most once.
- **Space Complexity:** O(1) besides the answer list.

## Implementation

```python
from typing import List
class Solution:
    def runRle(self, encoding: List[int], operations: List[str], values: List[int]) -> List[int]:
        idx = 0
        rem = encoding[0] if len(encoding) >= 2 else 0
        while idx < len(encoding) and rem == 0:
            idx += 2
            if idx < len(encoding):
                rem = encoding[idx]
        ans = []
        for n in values:
            res = -1
            while n > 0 and idx < len(encoding):
                if rem == 0:
                    idx += 2
                    if idx < len(encoding):
                        rem = encoding[idx]
                    continue
                v = encoding[idx + 1]
                if n <= rem:
                    rem -= n
                    res = v
                    n = 0
                    if rem == 0:
                        idx += 2
                        if idx < len(encoding):
                            rem = encoding[idx]
                else:
                    n -= rem
                    res = v
                    idx += 2
                    rem = encoding[idx] if idx < len(encoding) else 0
            if n > 0:
                res = -1
            ans.append(res)
        return ans
```
