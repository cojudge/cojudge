## Approach

Collapse the string into consecutive run lengths. Any valid piece must straddle one boundary between two runs and take equally many characters from each side, so the boundary contributes exactly the minimum of the two neighbouring run lengths. Adding that minimum over every boundary counts everything once.

## Complexity Analysis

- **Time Complexity:** O(n), a single left-to-right scan.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
class Solution:
    def countBinarySubstrings(self, s: str) -> int:
        prev, cur, ans = 0, 1, 0
        for i in range(1, len(s)):
            if s[i] == s[i-1]:
                cur += 1
            else:
                ans += min(prev, cur)
                prev, cur = cur, 1
        ans += min(prev, cur)
        return ans
```
