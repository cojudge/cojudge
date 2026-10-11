## Approach

Recurse on substring pairs with memoization over start positions and length. Identical slices succeed immediately and mismatched letter counts fail fast. Otherwise try each split in both straight and crossed alignments; any fully matching decomposition proves the pair are scrambles.

## Complexity Analysis

- **Time Complexity:** O(n^4) worst case over all states and splits, fine for n <= 30.
- **Space Complexity:** O(n^3) memoized states plus recursion depth O(n).

## Implementation

```python
class Solution:
    def isScramble(self, s1: str, s2: str) -> bool:
        from functools import lru_cache
        if len(s1) != len(s2):
            return False
        @lru_cache(maxsize=None)
        def dfs(i: int, j: int, length: int) -> bool:
            sub1 = s1[i:i + length]
            sub2 = s2[j:j + length]
            if sub1 == sub2:
                return True
            if sorted(sub1) != sorted(sub2):
                return False
            for k in range(1, length):
                if dfs(i, j, k) and dfs(i + k, j + k, length - k):
                    return True
                if dfs(i, j + length - k, k) and dfs(i + k, j, length - k):
                    return True
            return False
        return dfs(0, 0, len(s1))
```
