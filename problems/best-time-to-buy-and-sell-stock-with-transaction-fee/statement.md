You are given daily share prices and a fixed fee charged on every sale. You may complete any number of buys and sells, but you can hold at most one share at a time.

Buying costs the listed price; selling gains the price minus the fee. Passing on quiet days is always allowed.

Return the greatest profit achievable, or zero when no trade helps.

**Example 1:**
```
Input: prices = [1,3,2,8,4,9], fee = 2
Output: 8
Explanation: Trade 1 to 8 for 5 after the fee, then 4 to 9 for 3 more.
```

**Example 2:**
```
Input: prices = [1,3,7,5,10,3], fee = 3
Output: 6
Explanation: A single 1-to-10 trip earns 9 before the 3 fee.
```

**Example 3:**
```
Input: prices = [5,4,3,2,1], fee = 1
Output: 0
Explanation: With falling prices, doing nothing beats any sale.
```

**Constraints:**
- `1 <= prices.length <= 50000`
- `0 <= prices[i] < 50000`
- `0 <= fee < 50000`
