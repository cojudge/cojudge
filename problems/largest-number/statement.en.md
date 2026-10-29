Given non-negative integers, arrange their order so that gluing them together forms the largest possible number. Return that number as a string.

Comparison is by glued pairs: for two numbers `a` and `b`, place `a` before `b` when `a + b` is larger than `b + a`. When every number is zero, return `"0"` rather than a run of zeros.

**Constraints:**
- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 10^9`
