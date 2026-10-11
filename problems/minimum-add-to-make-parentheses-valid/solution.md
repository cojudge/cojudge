## Approach

Sweep once while holding the count of unmatched opens. A close with no open partner forces one inserted open; otherwise it cancels an open. Unmatched opens left at the end each force one inserted close, so the answer is the sum of both kinds of debt.

## Complexity Analysis

- **Time Complexity:** O(n) for a single pass.
- **Space Complexity:** O(1) extra space.

## Implementation

```python
class Solution:
    def minAddToMakeValid(self, s: str) -> int:
        open_count = 0
        need = 0
        for c in s:
            if c == '(':
                open_count += 1
            elif open_count > 0:
                open_count -= 1
            else:
                need += 1
        return open_count + need
```
