## Approach

Let `counts[j]` be the number of ways the processed source prefix forms the first `j`
characters of `t`. Process target positions from right to left so one source character
cannot be reused. States that no longer have enough source characters remaining to
finish `t` are skipped.

## Complexity Analysis

- **Time Complexity:** O(n * m), where `n = len(s)` and `m = len(t)`.
- **Space Complexity:** O(m).

## Implementation

```python
class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        source_length, target_length = len(s), len(t)
        if target_length > source_length:
            return 0

        counts = [0] * (target_length + 1)
        counts[0] = 1
        for i in range(1, source_length + 1):
            upper = min(i, target_length)
            lower = max(1, target_length - (source_length - i))
            for j in range(upper, lower - 1, -1):
                if s[i - 1] == t[j - 1]:
                    counts[j] += counts[j - 1]
        return counts[target_length]
```
