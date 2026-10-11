## Approach

Scan the string once while accumulating the width used on the current line. When the next letter would push the total past 100, start a new line with that letter; otherwise extend the current line. The line counter and the final width form the answer.

## Complexity Analysis

- **Time Complexity:** O(m), where m is the length of `s`.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def numberOfLines(self, widths: List[int], s: str) -> List[int]:
        if not s:
            return [0, 0]
        lines, cur = 1, 0
        for c in s:
            w = widths[ord(c) - 97]
            if cur + w > 100:
                lines += 1
                cur = w
            else:
                cur += w
        return [lines, cur]
```
