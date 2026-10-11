## Approach

Remember the final index of every digit. Then walk the number from left to right: at the first position where a bigger digit occurs later, swap it with the rightmost occurrence of the biggest such digit. If no position qualifies, the number is already maximal.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the digit count (at most 9).
- **Space Complexity:** O(1) besides the digit array.

## Implementation

```python
class Solution:
    def maximumSwap(self, num: int) -> int:
        d = list(str(num))
        last = {int(c): i for i, c in enumerate(d)}
        for i, c in enumerate(d):
            for v in range(9, int(c), -1):
                if last.get(v, -1) > i:
                    j = last[v]
                    d[i], d[j] = d[j], d[i]
                    return int("".join(d))
        return num
```
