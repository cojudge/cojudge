## Approach

Tally how many times each letter of `s` appears. Walk through `order` from
first to last, emitting each ranked letter as many times as it was counted.
Finally emit the leftover letters that never appeared in `order`. Ranked
blocks automatically respect the required precedence, and the multiset is
preserved.

## Complexity Analysis

- **Time Complexity:** O(|order| + |s|) for counting and rebuilding.
- **Space Complexity:** O(1) extra besides the output (a fixed 26-slot table).

## Implementation

```python
class Solution:
    def customSortString(self, order: str, s: str) -> str:
        count = [0] * 26
        for c in s:
            count[ord(c) - 97] += 1
        parts: list[str] = []
        for c in order:
            parts.append(c * count[ord(c) - 97])
            count[ord(c) - 97] = 0
        for i in range(26):
            if count[i]:
                parts.append(chr(i + 97) * count[i])
        return "".join(parts)
```
