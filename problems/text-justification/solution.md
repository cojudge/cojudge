## Approach

Scan words greedily, extending each line while letters plus one blank per gap still fit. For middle lines with several words, divide the leftover blanks evenly among gaps and hand the remainder to the leftmost gaps. Single-word lines and the final line are left-aligned with single gaps and trailing padding.

## Complexity Analysis

- **Time Complexity:** O(total characters), each word and blank written once.
- **Space Complexity:** O(total characters) for the output lines.

## Implementation

```python
from typing import List
class Solution:
    def fullJustify(self, words: List[str], maxWidth: int) -> List[str]:
        res = []
        i = 0
        while i < len(words):
            j = i
            line_len = 0
            while j < len(words) and line_len + len(words[j]) + (j - i) <= maxWidth:
                line_len += len(words[j])
                j += 1
            num = j - i
            is_last = (j == len(words))
            if num == 1 or is_last:
                line = " ".join(words[i:j])
                line += " " * (maxWidth - len(line))
                res.append(line)
            else:
                total = maxWidth - line_len
                gaps = num - 1
                base, extra = divmod(total, gaps)
                parts = []
                for k in range(i, j):
                    parts.append(words[k])
                    if k < j - 1:
                        spaces = base + (1 if k - i < extra else 0)
                        parts.append(" " * spaces)
                res.append("".join(parts))
            i = j
        return res
```
