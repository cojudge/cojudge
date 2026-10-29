## Approach

Keep a monotonic decreasing stack of `(price, span)` pairs. For each new price, start with span `1` and pop every stack top whose price is less than or equal to the current price, adding its span to the current one. Push the current pair and return its span. Each price is pushed and popped at most once.

## Complexity Analysis

- **Time Complexity:** O(1) amortized per `next` call.
- **Space Complexity:** O(n) for the monotonic stack in the worst case.

## Implementation

```python
class StockSpanner:
    def __init__(self):
        self.prices = []
        self.spans = []

    def next(self, price: int) -> int:
        span = 1
        while self.prices and self.prices[-1] <= price:
            self.prices.pop()
            span += self.spans.pop()
        self.prices.append(price)
        self.spans.append(span)
        return span
```
