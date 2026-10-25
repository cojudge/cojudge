## Approach

Start from one and multiply by the base once per loop iteration. After exp iterations the product equals base to the power exp.

## Complexity Analysis

- **Time Complexity:** O(exp).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def power(self, base: int, exp: int) -> int:
        result = 1
        for _ in range(exp):
            result *= base
        return result
```
