A shop sells `n` item kinds. `price[i]` is the shelf price of one unit of kind `i`. The shop also posts bundle deals: each row of `special` holds `n` counts followed by the bundle price, so `special[r][n]` is what the bundle costs instead of buying its items separately. You must buy exactly the quantities in `needs` and want the smallest possible total.

Implement `shoppingOffers(price, special, needs)`. You may use any deal any number of times as long as you never exceed the remaining need for any kind; leftover units are bought at shelf price.

**Constraints:**
- `1 <= n <= 6`
- `price.length == needs.length == n`, `0 <= price[i] <= 10`, `0 <= needs[i] <= 10`
- `1 <= special.length <= 100`; each row has `n + 1` entries with the last in `0..10`.
