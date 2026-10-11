A gang wants to run criminal schemes. There are `group.length` schemes; scheme `i` needs `group[i]` members and yields `profit[i]` coins. You have at most `n` members in total, and each scheme can be used at most once.

A plan is any collection of schemes whose member requirement fits within `n` people and whose total profit reaches at least `minProfit`. Count all such plans, including the choice of running nothing when it qualifies. Return the count modulo `10^9 + 7`.

**Constraints:**
- `1 <= n <= 100`
- `0 <= minProfit <= 100`
- `1 <= group.length <= 100`
- `1 <= group[i] <= 100`
- `0 <= profit[i] <= 100`
