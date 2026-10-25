## Approach

Use one if statement to detect negative inputs. Negate those inputs and return non-negative inputs unchanged.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def absVal(self, n: int) -> int:
        if n < 0:
            return -n
        return n
```
