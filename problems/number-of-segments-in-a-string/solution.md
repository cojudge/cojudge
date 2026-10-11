## Approach

Sweep the string once while remembering whether the previous character was inside a segment. Each transition from a space (or the start) to a non-space begins exactly one new segment, so counting those transitions gives the answer.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def countSegments(self, s: str) -> int:
        count = 0
        in_seg = False
        for c in s:
            if c != ' ':
                if not in_seg:
                    count += 1
                    in_seg = True
            else:
                in_seg = False
        return count
```
