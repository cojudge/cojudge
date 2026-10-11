## Approach

Backtrack over the pattern: bind each new letter to every feasible next block and recurse, enforcing a two-way (bijective) mapping.

## Complexity Analysis

- **Time Complexity:** O(n^m) worst case
- **Space Complexity:** O(m + n)

## Implementation

```python
class Solution:
    def wordPatternMatch(self, pattern: str, s: str) -> bool:
        mapping, used = {}, set()
        def dfs(i: int, j: int) -> bool:
            if i == len(pattern):
                return j == len(s)
            c = pattern[i]
            if c in mapping:
                w = mapping[c]
                return s.startswith(w, j) and dfs(i + 1, j + len(w))
            for k in range(j + 1, len(s) + 1):
                w = s[j:k]
                if w in used:
                    continue
                mapping[c] = w
                used.add(w)
                if dfs(i + 1, k):
                    return True
                del mapping[c]
                used.remove(w)
            return False
        return dfs(0, 0)
```
