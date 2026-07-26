## Approach

First reject any input whose lengths cannot add up. Let `possible[j]` indicate whether
the current prefix of `s1` together with the first `j` characters of `s2` forms the
corresponding prefix of `s3`. Each state can consume its next character from either
source while preserving both source orders.

## Complexity Analysis

- **Time Complexity:** O(m * n), where `m = len(s1)` and `n = len(s2)`.
- **Space Complexity:** O(n).

## Implementation

```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        if len(s1) + len(s2) != len(s3):
            return False

        possible = [False] * (len(s2) + 1)
        possible[0] = True
        for j in range(1, len(s2) + 1):
            possible[j] = possible[j - 1] and s2[j - 1] == s3[j - 1]
        for i in range(1, len(s1) + 1):
            possible[0] = possible[0] and s1[i - 1] == s3[i - 1]
            for j in range(1, len(s2) + 1):
                next_char = s3[i + j - 1]
                possible[j] = (
                    possible[j] and s1[i - 1] == next_char
                ) or (
                    possible[j - 1] and s2[j - 1] == next_char
                )
        return possible[-1]
```
