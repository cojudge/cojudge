## Approach

Keep a monotonic decreasing stack of `(price, span)` pairs. For each new
price, start with span `1` and pop every stack top whose price is less than
or equal to the current price, adding its span to the current one. Push the
current pair and record its span. This simulates consecutive `next` calls in
one pass.

## Complexity Analysis

- **Time Complexity:** `O(n)`, each price is pushed and popped at most once.
- **Space Complexity:** `O(n)` for the monotonic stack in the worst case.

## Implementation

```python
from typing import List


class Solution:
    def stockSpan(self, prices: List[int]) -> List[int]:
        price_stack: List[int] = []
        span_stack: List[int] = []
        spans: List[int] = []
        for price in prices:
            span = 1
            while price_stack and price_stack[-1] <= price:
                price_stack.pop()
                span += span_stack.pop()
            price_stack.append(price)
            span_stack.append(span)
            spans.append(span)
        return spans
```
