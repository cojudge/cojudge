## Approach

Keep a running total of distinct subsequences including the empty one. Each new character doubles the total, because every old subsequence can either skip or take it. When the character appeared before, the doubling recreates exactly the batch added at its previous appearance, so subtract that stored value. All steps use a modulus, and one is removed at the end for the empty subsequence.

## Complexity Analysis

- **Time Complexity:** O(n), one pass over the string.
- **Space Complexity:** O(1) besides the last-seen table of at most 26 letters.

## Implementation

```python
class Solution:
    def distinctSubseqII(self, s: str) -> int:
        MOD = 10 ** 9 + 7
        total = 1
        last = {}
        for c in s:
            prev = total
            total = (total * 2 - last.get(c, 0)) % MOD
            last[c] = prev
        return (total - 1) % MOD
```
