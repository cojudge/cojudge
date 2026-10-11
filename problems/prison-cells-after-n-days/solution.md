## Approach

Simulate the daily refresh, but memoize every layout seen so far. Because there are only finitely many rows, the layouts must eventually repeat, forming a cycle. Once a repeat is found, fast-forward over whole cycles in one jump and simulate only the leftover days. Each step compares the two neighbours of every interior cell while the ends always clear to zero.

## Complexity Analysis

- **Time Complexity:** O(1) — at most a few hundred simulated days regardless of N.
- **Space Complexity:** O(1) for the memo table of past layouts.

## Implementation

```python
class Solution:
    def prisonAfterNDays(self, cells: list[int], N: int) -> list[int]:
        cur = list(cells)
        seen = {}
        day = 0
        while day < N:
            key = tuple(cur)
            if key in seen:
                period = day - seen[key]
                rem = N - day
                if period > 0 and rem >= period:
                    day += (rem // period) * period
                    continue
            else:
                seen[key] = day
            nxt = [0] * 8
            for i in range(1, 7):
                nxt[i] = 1 if cur[i - 1] == cur[i + 1] else 0
            cur = nxt
            day += 1
        return cur
```
