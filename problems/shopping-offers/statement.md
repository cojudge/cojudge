A shop sells `n` item kinds. `price[i]` is the shelf price of one unit of kind `i`. The shop also posts bundle deals: each row of `special` holds `n` counts followed by the bundle price, so `special[r][n]` is what the bundle costs instead of buying its items separately. You must buy exactly the quantities in `needs` and want the smallest possible total.

Implement `shoppingOffers(price, special, needs)`. You may use any deal any number of times as long as you never exceed the remaining need for any kind; leftover units are bought at shelf price.

**Example 1:**
```
Input: price = [2,5], special = [[3,0,5],[1,2,10]], needs = [3,2]
Output: 14
Explanation: Take the second bundle once (10) plus one unit of kind 0 at 2 each twice? Cheapest is 14.
```

**Example 2:**
```
Input: price = [2,3,4], special = [[1,1,0,4],[2,2,1,9]], needs = [1,2,1]
Output: 11
Explanation: Buying everything separately costs 12; the first bundle saves 1.
```

**Example 3:**
```
Input: price = [5], special = [[1,4]], needs = [3]
Output: 12
Explanation: Three bundles at 4 each give 12, cheaper than 15 separate.
```

**Constraints:**
- `1 <= n <= 6`
- `price.length == needs.length == n`, `0 <= price[i] <= 10`, `0 <= needs[i] <= 10`
- `1 <= special.length <= 100`; each row has `n + 1` entries with the last in `0..10`.
