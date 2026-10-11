## Approach

Enumerate all powers of x up to the bound, and for each enumerate all powers of y while the sum stays within the bound. Collect the sums in a set to drop duplicates, then sort. When x or y equals 1 its powers never grow, so stop after the first one to avoid looping forever. Only logarithmically many powers exist, so the double loop is tiny.

## Complexity Analysis

- **Time Complexity:** O(log^2 bound) power pairs.
- **Space Complexity:** O(answer size) for the result set.

## Implementation

```python
class Solution:
    def powerfulIntegers(self, x: int, y: int, bound: int) -> list[int]:
        s = set()
        px = 1
        while px <= bound:
            py = 1
            while px + py <= bound:
                s.add(px + py)
                if y == 1:
                    break
                py *= y
            if x == 1:
                break
            px *= x
        return sorted(s)
```
