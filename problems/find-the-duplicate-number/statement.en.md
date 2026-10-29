You receive an integer array `nums` holding `n + 1` entries, each drawn from the interval `[1, n]`. One value occurs repeatedly; identify and return it.

A single distinct value is duplicated, though it may show up more than twice. Leave `nums` untouched and rely on only a constant amount of additional memory.

**Constraints:**

- `2 <= nums.length <= 100001`
- `1 <= nums[i] < nums.length`
- Precisely one distinct integer in `nums` shows up more than once.
- That duplicated integer may occur more than twice.

**Follow-up:** Is an `O(n)`-time approach achievable while keeping the input read-only and the extra memory at `O(1)`?
