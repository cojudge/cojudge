You are given a list `nums` with `n` entries where each value lies between `1` and `n`. Some numbers in that range appear twice while others never appear.

Return every number between `1` and `n` that never appears in `nums`, in increasing order.

> **Adaptation note:** the original LeetCode return type is `List<Integer>`; this problem uses the portable `int_list` output type with the same values in the same order.

**Constraints:**
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= nums.length`
