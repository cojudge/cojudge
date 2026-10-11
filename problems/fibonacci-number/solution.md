## Approach

Build the sequence from the bottom up while holding only two consecutive values. Start with 0 and 1, then repeatedly replace the pair `(a, b)` with `(b, a + b)` until reaching index `n`. The second component is exactly F(n).

## Complexity Analysis

- **Time Complexity:** O(n) additions.
- **Space Complexity:** O(1) extra memory.

## Implementation

```python
class Solution:
    def fib(self, n: int) -> int:
        if n <= 1:
            return n
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b
```
