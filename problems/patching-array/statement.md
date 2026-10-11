You start with a sorted array `nums` of positive integers and a target reach `n`. Using any subset of the array's elements (each at most once), you can assemble various totals. If every integer from `1` through `n` can already be formed this way, nothing needs to change. Otherwise you may insert extra numbers ("patches") anywhere in the array. Return the smallest number of patches that makes all values in `[1, n]` representable as subset sums.

**Constraints:**
- `1 <= nums.length <= 1000`
- `1 <= nums[i] <= 10^4`
- `nums` is sorted in non-decreasing order.
- `1 <= n <= 2^31 - 1`
