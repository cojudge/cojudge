## Approach

Decode the letter-count pairs once, then serve operations with an index plus remaining count. Next returns the current letter or blank when past the end; hasNext reports whether any characters remain.

## Complexity Analysis

- **Time Complexity:** O(C+Q) for compressed length C and Q operations.
- **Space Complexity:** O(C+Q).

## Implementation

```python
from typing import List
class Solution:
    def runCompressedIterator(self, compressed: str, operations: List[str]) -> List[str]:
        chs, cnts = [], []
        i, n = 0, len(compressed)
        while i < n:
            c = compressed[i]; i += 1
            j = i
            while j < n and compressed[j].isdigit():
                j += 1
            chs.append(c); cnts.append(int(compressed[i:j]) if j > i else 1)
            i = j
        ans, p, rem = [], 0, cnts[0] if cnts else 0
        for op in operations:
            if op == 'next':
                if p >= len(chs):
                    ans.append('')
                else:
                    ans.append(chs[p])
                    rem -= 1
                    if rem == 0:
                        p += 1
                        if p < len(cnts):
                            rem = cnts[p]
            elif op == 'hasNext':
                ans.append('true' if p < len(chs) else 'false')
        return ans
```
