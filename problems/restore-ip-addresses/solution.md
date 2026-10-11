## Approach

Depth-first search over octet boundaries, trying one to three digits per part. Cut off branches whose remaining length cannot fill the remaining octets, reject leading-zero and over-255 pieces immediately, and emit an address only when four parts consume the whole string.

## Complexity Analysis

- **Time Complexity:** O(1) in practice — at most 3^4 placements per input.
- **Space Complexity:** O(1) besides the output, recursion depth at most 4.

## Implementation

```python
from typing import List
class Solution:
    def restoreIpAddresses(self, s: str) -> List[str]:
        res = []
        cur = [""] * 4
        def backtrack(idx: int, part: int):
            if part == 4:
                if idx == len(s):
                    res.append(".".join(cur))
                return
            remaining = len(s) - idx
            left = 4 - part
            if remaining < left or remaining > left * 3:
                return
            for ln in range(1, 4):
                if idx + ln > len(s):
                    break
                piece = s[idx:idx + ln]
                if len(piece) > 1 and piece[0] == "0":
                    break
                if int(piece) > 255:
                    break
                cur[part] = piece
                backtrack(idx + ln, part + 1)
        backtrack(0, 0)
        return res
```
