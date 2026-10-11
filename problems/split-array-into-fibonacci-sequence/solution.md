## Approach

Fix the first two numbers by trying all plausible lengths (capped by the 32-bit limit and the no-leading-zero rule). From the third value on the sequence is forced: each next entry must equal the sum of the prior two and must appear verbatim at the current position. Depth-first search over the short prefix therefore explores every candidate, backtracking when the forced tail mismatches.

## Complexity Analysis

- **Time Complexity:** O(n^2) in the worst case for prefix choices, with linear extension per choice, where n is the digit count.
- **Space Complexity:** O(n) for the recursion stack and the answer list.

## Implementation

```python
from typing import List
class Solution:
    def splitIntoFibonacci(self, num: str) -> List[int]:
        res: List[int] = []
        n = len(num)
        def dfs(pos, cur):
            if pos == n:
                return len(cur) >= 3
            for ln in range(1, 11):
                if pos + ln > n:
                    break
                if ln > 1 and num[pos] == '0':
                    break
                v = int(num[pos:pos+ln])
                if v > 2**31 - 1:
                    break
                if len(cur) >= 2:
                    want = cur[-1] + cur[-2]
                    if v < want:
                        continue
                    if v > want:
                        break
                cur.append(v)
                if dfs(pos + ln, cur):
                    return True
                cur.pop()
                if len(cur) >= 2:
                    break
            return False
        if dfs(0, res):
            return res
        return []
```
