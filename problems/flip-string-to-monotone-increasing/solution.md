## Approach

Scan once while counting how many `'1'`s have been seen. Keep `flips`, the cheapest cost for the prefix so far. On `'1'` increment the ones count; on `'0'` we either flip this zero to one (`flips + 1`) or flip all previous ones to zero (`ones`), taking the cheaper option.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`. One left-to-right pass.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def minFlipsMonoIncr(self, s: str) -> int:
        ones = 0
        flips = 0
        for c in s:
            if c == '1':
                ones += 1
            else:
                flips = min(flips + 1, ones)
        return flips
```
