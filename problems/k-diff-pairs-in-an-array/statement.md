You are given an integer array `nums` and an integer `k`. A *k-diff pair* is a pair of distinct positions `(i, j)` with `i != j` such that `|nums[i] - nums[j]| == k`. Pairs are compared by their values, not their positions: for example, `(1, 2)` and `(2, 1)` describe the same pair, and two position pairs holding the same two values count only once.

Return the number of distinct k-diff pairs in the array.

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-10^7 <= nums[i] <= 10^7`
- `0 <= k <= 10^7`
