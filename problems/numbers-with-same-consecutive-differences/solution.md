## Approach

Grow numbers digit by digit: from each prefix, the next digit is forced to be `last + k` or `last - k` whenever those stay inside 0..9 (a single choice when k is 0). Start from every leading digit 1..9 — plus all of 0..9 when n is 1 — and collect each completed length-n number, then sort. The digit graph is tiny, so plain depth-first search enumerates everything.

## Complexity Analysis

- **Time Complexity:** O(9 * 2^n) bounded enumeration, at most a few thousand numbers.
- **Space Complexity:** O(answer size) plus recursion depth n.

## Implementation

```python
class Solution:
    def numsSameConsecDiff(self, n: int, k: int) -> list[int]:
        if n == 1:
            return list(range(10))
        res = []

        def dfs(cur, length):
            if length == n:
                res.append(cur)
                return
            last = cur % 10
            nxt = set()
            if last + k <= 9:
                nxt.add(last + k)
            if last - k >= 0:
                nxt.add(last - k)
            for d in sorted(nxt):
                dfs(cur * 10 + d, length + 1)

        for start in range(1, 10):
            dfs(start, 1)
        return sorted(res)
```
