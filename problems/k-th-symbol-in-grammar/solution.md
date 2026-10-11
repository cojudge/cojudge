## Approach

The symbol at `(n, k)` comes from the symbol at `(n-1, (k+1)/2)`: an odd
position copies its parent while an even position negates it. Unrolling this
parent chain counts how many times the path went to an even child, which is
exactly the number of set bits in `k-1`. An odd count yields `1`, otherwise `0`.

## Complexity Analysis

- **Time Complexity:** O(1) with a popcount, or O(n) by walking parents one row at a time.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def kthGrammar(self, n: int, k: int) -> int:
        return bin(k - 1).count("1") % 2
```
