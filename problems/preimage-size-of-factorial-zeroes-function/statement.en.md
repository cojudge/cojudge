For a non-negative integer `x`, write `zeros(x)` for the count of trailing
zeroes in the decimal form of `x!` (the factorial), with `zeros(0) = 0`
since `0! = 1`. The function climbs in flat stretches: several consecutive
`x` values share the same zero count, and some counts never occur at all.

Given `k`, count how many `x` satisfy `zeros(x) == k`. The answer turns out
to be either five (a full block between multiples of five) or zero (a count
that the factorial skips over).

**Constraints:**
- `0 <= k <= 10^9`
