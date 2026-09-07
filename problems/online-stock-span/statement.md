Design an algorithm that collects daily price quotes for some stock and returns
the span of that stock's price for the current day.

The span of the stock's price in one day is the maximum number of consecutive
days (starting from that day and going backward) for which the stock price was
less than or equal to the price of that day.

Given the full stream `prices` in order, return an array `spans` where
`spans[i]` is the answer that `next(prices[i])` would return if the prices
arrived one by one.

**Constraints:**

- `1 <= prices.length <= 10^4`
- `1 <= prices[i] <= 10^5`
