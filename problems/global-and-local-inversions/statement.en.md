You are given a permutation `nums` of the integers `0` through `n - 1`.

A global inversion is a pair of positions `i < j` with `nums[i] > nums[j]`. A local inversion is an index `i` with `nums[i] > nums[i+1]` (an adjacent global inversion). Every local inversion is global, but not vice versa.

Return `true` when the two counts coincide and `false` otherwise.

**Constraints:**
- `n == nums.length`
- `1 <= n <= 10^5`
- `0 <= nums[i] < n`
- All values are distinct
