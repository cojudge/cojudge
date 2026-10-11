Imagine receiving one stock price per day in sequence. For the current day, its span is the length of the longest suffix ending that day in which every price is at most today's price — equivalently, walk backward from today while prices stay less than or equal to today's price and count those days.

This task uses a batched form: you receive the whole sequence `prices` at once. Produce the array `spans`, where `spans[i]` equals what a streaming `next(prices[i])` call would have answered had the prices been fed in one after another.

**Constraints:**

- `1 <= prices.length <= 10^4`
- `1 <= prices[i] <= 10^5`
