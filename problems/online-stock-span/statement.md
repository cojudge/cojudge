Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day.

The span of the stock's price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.

For example, if the prices of the stock in the last four days are `[7,2,1,2]` and the price of the stock today is `2`, then the span of today is `4` because starting from today, the price of the stock was less than or equal to `2` for 4 consecutive days. Also, if the prices of the stock in the last four days are `[7,34,1,2]` and the price of the stock today is `8`, then the span of today is `3` because starting from today, the price of the stock was less than or equal to `8` for 3 consecutive days.

Implement the `StockSpanner` class:

- `StockSpanner()` Initializes the object.
- `int next(int price)` Returns the span of the stock's price given that today's price is `price`.

The class keeps its LeetCode name `StockSpanner` here (instead of `Solution`) because the judge harness reserves `Solution` for its driver; the constructor and method match the original.

Grading is deterministic: every `next` answer is compared exactly against a monotonic-stack reference model.

**Constraints:**
- `1 <= price <= 10^5`
- At most `10^4` calls will be made to `next`.
