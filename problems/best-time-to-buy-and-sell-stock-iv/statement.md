You are handed the daily prices of one stock as an array `prices`, where `prices[i]` is the price on day `i`. You may complete at most `k` round-trip trades: each trade means buying one share on some day and selling it on a later day. You cannot hold more than one share at a time (sell before buying again).

Compute the greatest total profit achievable. If no profitable trade exists, the answer is 0.

**Example 1:**
```
Input: k = 2, prices = [2,4,1]
Output: 2
Explanation: Buy on day 0 at 2 and sell on day 1 at 4 for a profit of 2. No second profitable trade exists.
```

**Example 2:**
```
Input: k = 2, prices = [3,2,6,5,0,3]
Output: 7
Explanation: Buy at 2, sell at 6 (profit 4), then buy at 0 and sell at 3 (profit 3), totalling 7.
```

**Example 3:**
```
Input: k = 1, prices = [1,2,3,4,5]
Output: 4
Explanation: With a single trade allowed, buy at 1 and sell at 5.
```

**Constraints:**
- `1 <= k <= 100`
- `0 <= prices.length <= 1000`
- `0 <= prices[i] <= 1000`
