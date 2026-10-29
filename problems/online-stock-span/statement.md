Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day.

The span of the stock's price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.

For example, if the prices of the stock in the last four days are `[7,2,1,2]` and the price of the stock today is `2`, then the span of today is `4` because starting from today, the price of the stock was less than or equal to `2` for 4 consecutive days. Also, if the prices of the stock in the last four days are `[7,34,1,2]` and the price of the stock today is `8`, then the span of today is `3` because starting from today, the price of the stock was less than or equal to `8` for 3 consecutive days.

Implement the `StockSpanner` class:

- `StockSpanner()` Initializes the object.
- `int next(int price)` Returns the span of the stock's price given that today's price is `price`.

The class keeps its LeetCode name `StockSpanner` here (instead of `Solution`) because the judge harness reserves `Solution` for its driver; the constructor and method match the original.

Grading is deterministic: every `next` answer is compared exactly against a monotonic-stack reference model.

**Example 1:**
```
Input: operations = ["StockSpanner","next","next","next","next","next","next","next"], values = [[],[100],[80],[60],[70],[60],[75],[85]]
Output: [null,1,1,1,2,1,4,6]
Explanation: Each span counts consecutive days backwards with price at most today's: day 4 (70) covers 60 and 70 for 2; day 6 (75) covers 60, 70, 60, 75 for 4; day 7 (85) covers all except 100 for 6.
```

**Example 2:**
```
Input: operations = ["StockSpanner","next","next","next","next","next","next"], values = [[],[10],[4],[5],[90],[120],[80]]
Output: [null,1,1,2,4,5,1]
Explanation: Spans are computed streaming: 5 covers 4 and 5, 90 covers all before it, 120 covers all before it, and 80 covers only itself.
```

**Example 3:**
```
Input: operations = ["StockSpanner","next","next","next"], values = [[],[30],[20],[10]]
Output: [null,1,1,1]
Explanation: Strictly decreasing prices each have a span of 1.
```

**Constraints:**
- `1 <= price <= 10^5`
- At most `10^4` calls will be made to `next`.
