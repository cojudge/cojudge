You are given a list `nums` with `n` entries. Every value lies between `1` and `n`. Each number shows up once or twice; some values show up twice and the rest show up once.

Collect every value that shows up twice and return them.

The order of the returned values does not matter.

> **Adaptation note:** the original LeetCode return type is `List<Integer>`; this problem uses the portable `int_list` output type with the same values.

**Constraints:**
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= nums.length`
