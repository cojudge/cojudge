## Approach

Sort the edit indices so they are visited left to right, then sweep a single cursor over the original string. Before each edit, copy any untouched gap characters directly to the answer; when the source matches the original at that index, emit the target and jump past the source, otherwise leave the cursor so the raw text flows through. A trailing copy drains the remainder after the last edit.

## Complexity Analysis

- **Time Complexity:** O(m log m + n * L) where m is the edit count, n the string length, and L the longest source.
- **Space Complexity:** O(n + total target length) for the output.

## Implementation

```python
from typing import List

class Solution:
    def findReplaceString(self, s: str, indices: List[int], sources: List[str], targets: List[str]) -> str:
        order = sorted(range(len(indices)), key=lambda i: indices[i])
        ans = []
        pos = 0
        for oi in order:
            idx = indices[oi]
            if idx < pos:
                continue
            while pos < idx:
                ans.append(s[pos])
                pos += 1
            if s.startswith(sources[oi], idx):
                ans.append(targets[oi])
                pos = idx + len(sources[oi])
        ans.append(s[pos:])
        return "".join(ans)
```
