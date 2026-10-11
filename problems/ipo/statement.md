A firm wants to grow its funds before going public by completing selected ventures. It can complete no more than `k` different ventures.

There are `n` candidate ventures, where venture `i` yields a net gain of `profits[i]` and requires holding at least `capital[i]` before it may begin.

You begin with `w` in capital. Completing a venture adds its gain to your holdings.

Choose up to `k` different ventures in a feasible sequence to leave your holdings as large as possible, and return that final holding amount.

The result is guaranteed to fit in a 32-bit signed integer.

**Constraints:**

- `1 <= k <= 10^5`
- `0 <= w <= 10^9`
- `n == profits.length`
- `n == capital.length`
- `1 <= n <= 10^5`
- `0 <= profits[i] <= 10^4`
- `0 <= capital[i] <= 10^9`
