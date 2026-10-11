## Approach

Count every letter, then pull out digits that own a unique letter: `z` only appears in zero, `w` in two, `u` in four, `x` in six, `g` in eight. Subtract those contributions and continue with letters that become unique afterwards (`h` for three, `f` for five, `s` for seven, then `o` for one and `i` for nine). Emit each digit its counted number of times in increasing order.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`. Counting is linear and the rest is constant work.
- **Space Complexity:** O(1) for the fixed-size frequency tables.

## Implementation

```python
class Solution:
    def originalDigits(self, s: str) -> str:
        from collections import Counter
        cnt = Counter(s)
        d = [0] * 10
        d[0] = cnt['z']
        d[2] = cnt['w']
        d[4] = cnt['u']
        d[6] = cnt['x']
        d[8] = cnt['g']
        d[3] = cnt['h'] - d[8]
        d[5] = cnt['f'] - d[4]
        d[7] = cnt['s'] - d[6]
        d[1] = cnt['o'] - d[0] - d[2] - d[4]
        d[9] = cnt['i'] - d[5] - d[6] - d[8]
        return ''.join(str(i) * d[i] for i in range(10))
```
