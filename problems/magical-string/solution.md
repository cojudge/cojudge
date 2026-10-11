## Approach

Seed the list with `[1, 2, 2]` and keep a read index pointing at the run-length source. Repeatedly append the alternating digit (`1` then `2`) as many times as the current run length demands, flipping the digit and advancing the pointer each round until the length reaches `n`. Finally tally the `1`s in the first `n` slots.

## Complexity Analysis

- **Time Complexity:** O(n) to build and count.
- **Space Complexity:** O(n) for the generated prefix.

## Implementation

```python
class Solution:
    def magicalString(self, n: int) -> int:
        if n <= 0:
            return 0
        if n <= 3:
            return 1
        s = [1, 2, 2]
        idx = 2
        nxt = 1
        while len(s) < n:
            s.extend([nxt] * s[idx])
            nxt = 3 - nxt
            idx += 1
        return s[:n].count(1)
```
