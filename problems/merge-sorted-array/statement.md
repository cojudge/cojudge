Two integer arrays `nums1` and `nums2` are provided in non-decreasing order, together with integers `m` and `n` stating how many meaningful entries each one contributes.

The array `nums1` has total capacity `m + n`: its leading `m` positions contain the values to keep, while its trailing `n` positions are placeholders filled with `0` and carry no information. The array `nums2` holds exactly `n` values.

Combine the `m` kept values of `nums1` with the `n` values of `nums2` into one collection ordered from smallest to largest, and return that combined array.

**Constraints:**

- nums1.length == m + n
- nums2.length == n
- 0 ≤ m, n ≤ 200
- 1 ≤ m + n ≤ 200
- -10^9 ≤ nums1[i], nums2[j] ≤ 10^9
