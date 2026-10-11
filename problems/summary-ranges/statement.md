You are given a sorted array `nums` of distinct integers. Compress every maximal run of consecutive numbers into a short label: a lone value `a` becomes `"a"`, while a run from `a` to `b` (with `b > a`) becomes `"a->b"`.

Return the labels in the order the runs appear.

**Constraints:**
- `0 <= nums.length <= 20`
- `-2^31 <= nums[i] <= 2^31 - 1`
- `nums` is sorted in strictly increasing order.
