You are given an integer array `nums` and an integer `k`. A subarray is called *good* when it uses at least two consecutive positions and its elements add up to a multiple of `k` (that is, the sum divided by `k` leaves remainder zero; when `k` is zero this means the sum itself must be zero).

Return `true` if `nums` contains at least one good subarray, and `false` otherwise.

**Constraints:**
- `1 <= nums.length <= 10^5`
- `0 <= nums[i] <= 10^9`
- `0 <= k <= 2^31 - 1`
