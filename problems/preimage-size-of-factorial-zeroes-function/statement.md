For a non-negative integer `x`, write `zeros(x)` for the count of trailing
zeroes in the decimal form of `x!` (the factorial), with `zeros(0) = 0`
since `0! = 1`. The function climbs in flat stretches: several consecutive
`x` values share the same zero count, and some counts never occur at all.

Given `k`, count how many `x` satisfy `zeros(x) == k`. The answer turns out
to be either five (a full block between multiples of five) or zero (a count
that the factorial skips over).

**Example 1:**
```
Input: k = 0
Output: 5
Explanation: The values 0, 1, 2, 3, and 4 all have factorials ending in no
zeroes.
```

**Example 2:**
```
Input: k = 5
Output: 0
Explanation: The zero count jumps from 4 directly to 6, so no x yields 5.
```

**Example 3:**
```
Input: k = 3
Output: 5
Explanation: The values 15, 16, 17, 18, and 19 each give three trailing
zeroes.
```

**Constraints:**
- `0 <= k <= 10^9`
