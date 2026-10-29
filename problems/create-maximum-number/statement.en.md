You are given two arrays `nums1` and `nums2` of digits (each entry `0`–`9`, with lengths `m` and `n`) plus an integer `k` with `1 <= k <= m + n`. Build the largest possible number with exactly `k` digits by picking some digits from each array so that the digits taken from either array keep their original relative order.

Digits from the two arrays may be interleaved freely. Compare candidate numbers digit by digit from the most significant side (all have length `k`). Return the winning digits as an array.

**Constraints:**
- `m == nums1.length`, `n == nums2.length`
- `1 <= m, n <= 500`
- `0 <= nums1[i], nums2[i] <= 9`
- `1 <= k <= m + n`
