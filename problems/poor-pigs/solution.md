## Approach

Compute the number of full rounds as integer division of the total time by the time to die. Each pig then has `rounds + 1` observable outcomes, and `p` pigs jointly cover `(rounds + 1)^p` buckets. Grow the pig count until the coverage reaches the number of buckets; that count is minimal because any smaller count covers fewer buckets.

## Complexity Analysis

- **Time Complexity:** O(p), where p is the answer (a handful of multiplications).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def poorPigs(self, buckets: int, minutesToDie: int, minutesToTest: int) -> int:
        states = minutesToTest // minutesToDie + 1
        pigs = 0
        coverage = 1
        while coverage < buckets:
            pigs += 1
            coverage *= states
        return pigs
```
