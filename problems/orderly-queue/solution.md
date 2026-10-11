## Approach

Two regimes appear. With a single movable slot, the string can only spin, so every rotation is a candidate and the dictionary-minimum wins. With at least two movable slots, the operation is powerful enough to mimic bubble sorting (repeatedly ferrying the current minimum forward), hence any permutation is reachable and the fully sorted string is the optimum.

## Complexity Analysis

- **Time Complexity:** O(n^2) for k equal to 1 due to comparing n rotations; O(n log n) for k above 1 due to sorting.
- **Space Complexity:** O(n) for the rotation copies and the sorted buffer.

## Implementation

```python
class Solution:
    def orderlyQueue(self, s: str, k: int) -> str:
        if k > 1:
            return "".join(sorted(s))
        best = s
        for i in range(1, len(s)):
            rot = s[i:] + s[:i]
            if rot < best:
                best = rot
        return best
```
