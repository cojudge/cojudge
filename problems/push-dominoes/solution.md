## Approach

Sweep left to right carrying a decaying rightward force that an R refreshes to full strength and an L clears; add it per cell. Sweep right to left the same way for leftward force and subtract it. Each cell's sign then decides its fate: positive falls right, negative falls left, zero stays upright — which naturally splits R...L gaps down the middle.

## Complexity Analysis

- **Time Complexity:** O(n) where n is the number of dominoes; two linear sweeps.
- **Space Complexity:** O(n) for the force array.

## Implementation

```python
class Solution:
    def pushDominoes(self, dominoes: str) -> str:
        n = len(dominoes)
        force = [0] * n
        f = 0
        for i, c in enumerate(dominoes):
            if c == "R":
                f = n
            elif c == "L":
                f = 0
            else:
                f = max(f - 1, 0)
            force[i] += f
        f = 0
        for i in range(n - 1, -1, -1):
            c = dominoes[i]
            if c == "L":
                f = n
            elif c == "R":
                f = 0
            else:
                f = max(f - 1, 0)
            force[i] -= f
        return "".join("R" if x > 0 else ("L" if x < 0 else ".") for x in force)
```
