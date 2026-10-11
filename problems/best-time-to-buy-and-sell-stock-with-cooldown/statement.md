The array `prices` lists one stock's daily quote, where `prices[i]` is what the share costs on day `i`. Chain together as many buy-then-sell round trips as you find worthwhile and report the best total profit they can yield.

Two trading rules apply throughout: your hand may carry at most one share at any moment, and the day directly after any sale is a mandatory rest day on which buying is forbidden.

**Constraints:**
- `1 <= prices.length <= 5000`
- `0 <= prices[i] <= 1000`
