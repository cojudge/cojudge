## Approach

Flag each character covered by any keyword hit. For every word, repeatedly search forward from the previous hit plus one so overlapping copies are caught, marking the whole span. Then walk the text once, opening a tag at the start of each flagged run and closing it at the run end; adjacent flagged cells naturally join into one pair.

## Complexity Analysis

- **Time Complexity:** O(m * n), where m is total keyword characters scanned against text length n with naive search.
- **Space Complexity:** O(n) for the flag array and output.

## Implementation

```python
from typing import List
class Solution:
    def addBoldTag(self, s: str, dict: List[str]) -> str:
        n = len(s)
        bold = [False] * n
        for w in dict:
            if not w:
                continue
            start = s.find(w, 0)
            while start != -1:
                for k in range(start, start + len(w)):
                    bold[k] = True
                start = s.find(w, start + 1)
        out = []
        for i, ch in enumerate(s):
            if bold[i] and (i == 0 or not bold[i - 1]):
                out.append("<b>")
            out.append(ch)
            if bold[i] and (i == n - 1 or not bold[i + 1]):
                out.append("</b>")
        return "".join(out)
```
