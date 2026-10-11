## Approach

Handle the two possible length relationships separately. When the strings share the same length, scan once and require exactly one mismatched position (a replacement). When lengths differ by one, walk both strings together and allow a single skip in the longer string (an insertion or deletion). Any larger length gap is immediately false.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the longer string length. Each character is visited at most once.
- **Space Complexity:** O(1) besides the inputs.

## Implementation

```python
class Solution:
    def isOneEditDistance(self, s: str, t: str) -> bool:
        m, n = len(s), len(t)
        if abs(m - n) > 1:
            return False
        if m == n:
            diff = sum(1 for a, b in zip(s, t) if a != b)
            return diff == 1
        longer, shorter = (s, t) if m > n else (t, s)
        i = j = 0
        skipped = False
        while i < len(longer) and j < len(shorter):
            if longer[i] == shorter[j]:
                i += 1
                j += 1
            else:
                if skipped:
                    return False
                skipped = True
                i += 1
        return True
```
