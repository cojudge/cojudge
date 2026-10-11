You are given daily prices `prices[i]` for a stock. You may complete at most two separate trades, where each trade is one purchase followed by one later sale.

You must sell before buying again, so the two trades never overlap. You may also choose to trade once or not at all.

Return the greatest total profit achievable.

**Example 1:**
```
Input: prices = [3,3,5,0,0,3,1,4]
Output: 6
Explanation: Buy at 0, sell at 3, then buy at 1 and sell at 4 for 3 + 3 = 6.
```

**Example 2:**
```
Input: prices = [1,2,3,4,5]
Output: 4
Explanation: One trade from 1 to 5 already gives 4; a second trade adds nothing.
```

**Example 3:**
```
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: Prices only fall, so skipping all trades is best.
```

**Constraints:**
- `1 <= prices.length <= 10^5`
- `0 <= prices[i] <= 10^5`
