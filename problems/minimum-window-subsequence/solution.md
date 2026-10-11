## Approach

Move a forward pointer through `s1`, advancing through `s2` on matches until one full copy of `s2` is consumed. From that end position, walk backwards through `s1` matching `s2` in reverse to locate the earliest start of this particular match. Record the window when it beats the best length seen so far, then resume the forward scan just after that start.

## Complexity Analysis

- **Time Complexity:** O(n * m) in the worst case, where n and m are the lengths of `s1` and `s2`.
- **Space Complexity:** O(1) besides the output.

## Implementation

```python
class Solution:
    def minWindow(self, s1: str, s2: str) -> str:
        n, m = len(s1), len(s2)
        best, best_start = 10 ** 9, -1
        i = 0
        while i < n:
            j, k = 0, i
            while k < n and j < m:
                if s1[k] == s2[j]:
                    j += 1
                k += 1
            if j < m:
                break
            end = k - 1
            j, k = m - 1, end
            while k >= i and j >= 0:
                if s1[k] == s2[j]:
                    j -= 1
                k -= 1
            start = k + 1
            if end - start + 1 < best:
                best, best_start = end - start + 1, start
            i = start + 1
        return "" if best_start == -1 else s1[best_start:best_start + best]
```
