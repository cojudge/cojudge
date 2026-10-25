## Approach

Apply Euclid's reduction: when the second value hits zero the first is the answer, otherwise recurse on the pair shifted by the remainder.

## Complexity Analysis

- **Time Complexity:** O(log min(a, b)).
- **Space Complexity:** O(log min(a, b)).

## Implementation

```python
class Solution:
    def gcd(self, a: int, b: int) -> int:
        if b == 0:
            return a
        return self.gcd(b, a % b)
```
