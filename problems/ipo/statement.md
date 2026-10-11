A firm wants to grow its funds before going public by completing selected ventures. It can complete no more than `k` different ventures.

There are `n` candidate ventures, where venture `i` yields a net gain of `profits[i]` and requires holding at least `capital[i]` before it may begin.

You begin with `w` in capital. Completing a venture adds its gain to your holdings.

Choose up to `k` different ventures in a feasible sequence to leave your holdings as large as possible, and return that final holding amount.

The result is guaranteed to fit in a 32-bit signed integer.

**Example 1:**

```
Input: k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]
Output: 4
Explanation: Beginning with 0 capital, only the venture indexed 0 is initially reachable.
```

**Example 2:**

```
Input: k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]
Output: 6
```

**Constraints:**

- `1 <= k <= 10^5`
- `0 <= w <= 10^9`
- `n == profits.length`
- `n == capital.length`
- `1 <= n <= 10^5`
- `0 <= profits[i] <= 10^4`
- `0 <= capital[i] <= 10^9`
