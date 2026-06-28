## Approach

DP where ways at position i depends on single-digit decode (s[i] != '0') and two-digit decode (10-26).

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def numDecodings(self, s: str) -> int:
        if not s or s[0] == '0':
            return 0
        MASK = 0xFFFFFFFF
        prev2, prev1 = 1, 1
        for i in range(1, len(s)):
            cur = 0
            if s[i] != '0':
                cur = (cur + prev1) & MASK
            if s[i-1] == '1' or (s[i-1] == '2' and s[i] <= '6'):
                cur = (cur + prev2) & MASK
            prev2, prev1 = prev1, cur
        return prev1 if prev1 < 0x80000000 else prev1 - 0x100000000
```
