## Approach

Remove the surrounding parentheses and try every way to split the digit core into a left and right half. For each half, generate all legal numbers: a single digit is always fine; otherwise handle the leading-zero and trailing-zero cases first, and in the general case offer the plain integer plus every single-dot placement. Pair every left option with every right option and format as `"(a, b)"`. Sorting at comparison time makes order irrelevant.

## Complexity Analysis

- **Time Complexity:** O(n^3) for n inner digits, dominated by building decimal strings.
- **Space Complexity:** O(n^2) for the option lists and output.

## Implementation

```python
from typing import List
class Solution:
    def ambiguousCoordinates(self, s: str) -> List[str]:
        t = s[1:-1]
        def make(part: str) -> List[str]:
            n = len(part)
            if n == 0:
                return []
            if n == 1:
                return [part]
            if part[0] == '0' and part[-1] == '0':
                return []
            if part[0] == '0':
                return ["0." + part[1:]]
            if part[-1] == '0':
                return [part]
            out = [part]
            for i in range(1, n):
                out.append(part[:i] + "." + part[i:])
            return out
        res = []
        for i in range(1, len(t)):
            for a in make(t[:i]):
                for b in make(t[i:]):
                    res.append(f"({a}, {b})")
        return res
```
