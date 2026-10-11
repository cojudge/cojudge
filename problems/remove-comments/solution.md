## Approach

Walk each line with an index and an `in_block` flag. Outside a block, `//` stops the line and `/*` opens a block; inside, only `*/` matters and everything else is skipped. Surviving characters accumulate in a buffer that is flushed as one answer line whenever a source line ends outside a block with content.

## Complexity Analysis

- **Time Complexity:** O(T), where T is the total character count.
- **Space Complexity:** O(T) for the buffer and answers.

## Implementation

```python
from typing import List
class Solution:
    def removeComments(self, source: List[str]) -> List[str]:
        ans = []
        buf = []
        in_block = False
        for line in source:
            i = 0
            n = len(line)
            while i < n:
                if not in_block and i + 1 < n and line[i:i+2] == "//":
                    break
                elif not in_block and i + 1 < n and line[i:i+2] == "/*":
                    in_block = True
                    i += 2
                elif in_block and i + 1 < n and line[i:i+2] == "*/":
                    in_block = False
                    i += 2
                elif in_block:
                    i += 1
                else:
                    buf.append(line[i])
                    i += 1
            if not in_block and buf:
                ans.append(''.join(buf))
                buf = []
        return ans
```
