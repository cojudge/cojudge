A gang wants to run criminal schemes. There are `group.length` schemes; scheme `i` needs `group[i]` members and yields `profit[i]` coins. You have at most `n` members in total, and each scheme can be used at most once.

A plan is any collection of schemes whose member requirement fits within `n` people and whose total profit reaches at least `minProfit`. Count all such plans, including the choice of running nothing when it qualifies. Return the count modulo `10^9 + 7`.

**Example 1:**
```
Input: n = 5, minProfit = 3, group = [2,2], profit = [2,3]
Output: 2
Explanation: Running only the second scheme earns 3, and running both earns 5; both plans fit in 5 members.
```

**Example 2:**
```
Input: n = 10, minProfit = 5, group = [2,3,5], profit = [6,7,8]
Output: 7
Explanation: Every non-empty collection earns at least 5 and uses at most 10 members, giving 2^3 - 1 = 7 plans.
```

**Example 3:**
```
Input: n = 1, minProfit = 1, group = [1], profit = [1]
Output: 1
Explanation: The single scheme fits and earns exactly 1.
```

**Constraints:**
- `1 <= n <= 100`
- `0 <= minProfit <= 100`
- `1 <= group.length <= 100`
- `1 <= group[i] <= 100`
- `0 <= profit[i] <= 100`
