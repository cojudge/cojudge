Koko has several piles of bananas. `piles[i]` is the number of bananas in pile `i`, and Koko has `h` hours before the guards return.

Koko chooses one positive integer eating speed `k` in bananas per hour. During each hour, she chooses one pile and eats up to `k` bananas from it. If that pile has fewer than `k` bananas, she finishes the pile and does not eat from another pile during the same hour.

Return the minimum integer speed that lets Koko finish all piles within `h` hours.

**Constraints:**

- `1 <= piles.length <= 10^4`
- `1 <= piles[i] <= 10^9`
- `piles.length <= h <= 10^9`

**Portable interface:** Implement `minEatingSpeed(piles, h)` directly. The judge supplies positive pile sizes and returns the minimum speed as an integer.
