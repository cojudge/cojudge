## Approach

Place the pancakes one by one from the largest down. For the unsorted prefix, locate its maximum; if it sits on top, flip the whole prefix to drop it into place, otherwise first flip it to the top and then flip the prefix. Each size needs at most two flips, so the total stays far below the limit and the replay check confirms sortedness.

## Complexity Analysis

- **Time Complexity:** O(n^2) — finding each maximum scans the remaining prefix.
- **Space Complexity:** O(n) for the answer plus the working copy.

## Implementation

```python
class Solution:
    def pancakeSort(self, arr: list[int]) -> list[int]:
        a = list(arr)
        res = []
        for size in range(len(a), 1, -1):
            mx = max(range(size), key=lambda i: a[i])
            if mx == size - 1:
                continue
            if mx != 0:
                a[:mx + 1] = reversed(a[:mx + 1])
                res.append(mx + 1)
            a[:size] = reversed(a[:size])
            res.append(size)
        return res
```
