## Approach

Every power of 3 below 2^31 divides the largest one, 3^19 = 1162261467, and no other positive integer does. So the test reduces to checking positivity plus this single divisibility. Equivalently, one can repeatedly divide by 3 and see whether the remainder reaches 1.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def isPowerOfThree(self, n: int) -> bool:
        return n > 0 and 1162261467 % n == 0
```
